from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
  CourseViewSet,
  CourseOfferingViewSet,
  TAViewSet,
  TACourseRelViewSet,
  HomeworkViewSet,
  QuestionViewSet,
  GradingRelViewSet,
)

router = DefaultRouter()
router.register(r"courses", CourseViewSet)
router.register(r"course-offerings", CourseOfferingViewSet)
router.register(r"tas", TAViewSet)
router.register(r"ta-courses", TACourseRelViewSet)
router.register(r"homeworks", HomeworkViewSet)
router.register(r"hw-questions", QuestionViewSet)
router.register(r"grading-assignments", GradingRelViewSet)

urlpatterns = [
  path("", include(router.urls)),

]