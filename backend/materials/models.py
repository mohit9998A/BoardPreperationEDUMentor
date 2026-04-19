from django.db import models
from django.conf import settings


class Material(models.Model):
    """Study material uploaded by teachers."""
    SUBJECT_CHOICES = [
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('mathematics', 'Mathematics'),
        ('biology', 'Biology'),
        ('english', 'English'),
    ]
    CLASS_CHOICES = [
        ('10', 'Class 10'),
        ('12', 'Class 12'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='physics')
    class_level = models.CharField(max_length=5, choices=CLASS_CHOICES, default='12')
    file = models.FileField(upload_to='materials/%Y/%m/', blank=True, null=True)
    file_url = models.URLField(blank=True, default='')
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='materials'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'materials'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_subject_display()})"
