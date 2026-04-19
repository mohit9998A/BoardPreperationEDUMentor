from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestViewSet, ResultViewSet

router = DefaultRouter()
router.register('', TestViewSet, basename='test')

urlpatterns = [
    path('results/', ResultViewSet.as_view({'get': 'list'}), name='results-list'),
    path('', include(router.urls)),
]
