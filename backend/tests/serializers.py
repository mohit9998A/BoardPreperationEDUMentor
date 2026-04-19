from rest_framework import serializers
from .models import Test, Question, Result


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'order']
        # correct_option deliberately excluded for students


class QuestionAdminSerializer(serializers.ModelSerializer):
    """For teachers — includes correct answer."""
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'order']


class TestListSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = [
            'id', 'title', 'description', 'subject', 'class_level',
            'duration_minutes', 'teacher', 'teacher_name',
            'question_count', 'is_active', 'created_at',
        ]
        read_only_fields = ['teacher', 'teacher_name', 'question_count']

    def get_teacher_name(self, obj):
        return obj.teacher.get_full_name() or obj.teacher.email

    def get_question_count(self, obj):
        return obj.questions.count()


class TestDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = [
            'id', 'title', 'description', 'subject', 'class_level',
            'duration_minutes', 'teacher_name', 'questions', 'is_active', 'created_at',
        ]

    def get_teacher_name(self, obj):
        return obj.teacher.get_full_name() or obj.teacher.email


class ResultSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'test', 'test_title', 'student', 'student_name', 'score', 'total', 'answers', 'submitted_at']
        read_only_fields = ['student', 'student_name']

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.email


class SubmitTestSerializer(serializers.Serializer):
    answers = serializers.DictField(child=serializers.CharField())
