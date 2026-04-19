from rest_framework import serializers
from .models import Material


class MaterialSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = [
            'id', 'title', 'description', 'subject', 'class_level',
            'file', 'file_url', 'teacher', 'teacher_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['teacher', 'teacher_name']

    def get_teacher_name(self, obj):
        return obj.teacher.get_full_name() or obj.teacher.email
