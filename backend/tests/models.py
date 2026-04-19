from django.db import models
from django.conf import settings


class Test(models.Model):
    """Mock test created by teachers."""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    subject = models.CharField(max_length=20, default='physics')
    class_level = models.CharField(max_length=5, default='12')
    duration_minutes = models.IntegerField(default=60)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tests'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tests'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Question(models.Model):
    """MCQ question belonging to a test."""
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.CharField(max_length=1, choices=[
        ('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'),
    ])
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'questions'
        ordering = ['order']

    def __str__(self):
        return f"Q{self.order}: {self.text[:50]}"


class Result(models.Model):
    """Student test result."""
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='results'
    )
    score = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    answers = models.JSONField(default=dict, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'results'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student} — {self.test.title}: {self.score}/{self.total}"
