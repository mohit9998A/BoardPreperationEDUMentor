from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from django.contrib.auth import get_user_model
from datetime import datetime
from boardprep.mongo import get_users_collection

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        # 'username' is intentionally excluded — it is auto-derived from email
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'first_name': {'required': False, 'default': ''},
            'last_name': {'required': False, 'default': ''},
            'role': {'required': False, 'default': 'student'},
        }

    def validate_email(self, value):
        """Check email uniqueness in both Django DB and MongoDB."""
        # Check Django DB first
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")

        # Also check MongoDB (non-blocking — logs warning if MongoDB is down)
        try:
            mongo_users = get_users_collection()
            if mongo_users.find_one({"email": value}):
                raise serializers.ValidationError("A user with that email already exists.")
        except serializers.ValidationError:
            raise  # Re-raise validation errors
        except Exception as e:
            # MongoDB is optional/secondary — log but don't block registration
            print(f"[WARN] MongoDB connectivity check failed: {e}")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        role = validated_data.get('role', 'student')
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')

        print(f"[REGISTER] Attempting to register user: {email}")

        # 1. Save to Django (SQLite) — this is the authoritative store
        try:
            user = User.objects.create_user(
                username=email,  # auto-derive username from email
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=role,
            )
            print(f"[REGISTER] Successfully saved to Django SQLite: {user.id}")
        except Exception as e:
            print(f"[REGISTER] FAILED to save to Django SQLite: {e}")
            raise serializers.ValidationError({"error": f"Registration failed: {e}"})

        # 2. Save to MongoDB (secondary — best-effort)
        try:
            mongo_users = get_users_collection()
            mongo_users.insert_one({
                "django_id": user.id,
                "name": f"{first_name} {last_name}".strip(),
                "email": email,
                "password": make_password(password),
                "role": role,
                "created_at": datetime.utcnow()
            })
            print("[REGISTER] Successfully saved to MongoDB")
        except Exception as e:
            # Don't fail the registration if MongoDB is down
            print(f"[REGISTER] WARNING — MongoDB write failed (non-fatal): {e}")

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
