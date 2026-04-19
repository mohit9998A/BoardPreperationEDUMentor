from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Material
from .serializers import MaterialSerializer


class IsTeacherOrReadOnly(permissions.BasePermission):
    """Only teachers can create/update/delete. Students can read."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'teacher'


class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Material.objects.all()
        teacher_id = self.request.query_params.get('teacher')
        subject = self.request.query_params.get('subject')
        class_level = self.request.query_params.get('class_level')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if subject:
            queryset = queryset.filter(subject=subject)
        if class_level:
            queryset = queryset.filter(class_level=class_level)
        return queryset

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)
