from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Test, Question, Result
from .serializers import (
    TestListSerializer, TestDetailSerializer,
    ResultSerializer, SubmitTestSerializer, QuestionAdminSerializer,
)


class IsTeacherOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'teacher'


class TestViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TestDetailSerializer
        return TestListSerializer

    def get_queryset(self):
        queryset = Test.objects.all()
        teacher_id = self.request.query_params.get('teacher')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if self.request.user.role == 'student':
            queryset = queryset.filter(is_active=True)
        return queryset

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        """Student submits answers for a test."""
        test = self.get_object()
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data['answers']
        questions = test.questions.all()
        score = 0
        total = questions.count()

        for q in questions:
            submitted = answers.get(str(q.id), '')
            if submitted.upper() == q.correct_option:
                score += 1

        result = Result.objects.create(
            test=test,
            student=request.user,
            score=score,
            total=total,
            answers=answers,
        )
        return Response(ResultSerializer(result).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def add_questions(self, request, pk=None):
        """Teacher adds questions to a test (batch)."""
        test = self.get_object()
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can add questions'}, status=status.HTTP_403_FORBIDDEN)

        serializer = QuestionAdminSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        questions = [Question(test=test, **item) for item in serializer.validated_data]
        Question.objects.bulk_create(questions)
        return Response({'created': len(questions)}, status=status.HTTP_201_CREATED)


class ResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Result.objects.filter(student=user)
        return Result.objects.filter(test__teacher=user)
