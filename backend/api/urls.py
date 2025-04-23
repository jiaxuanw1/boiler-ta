from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
  CourseOfferingTAStats,
  CourseViewSet,
  CourseOfferingViewSet,
  TAViewSet,
  TACourseRelViewSet,
  HomeworkViewSet,
  QuestionViewSet,
  GradingRelViewSet,
  TAAssignmentsForHomeworkView,
  TAsForCourseView
)

router = DefaultRouter()
router.register(r"courses", CourseViewSet)
router.register(r"course-offerings", CourseOfferingViewSet)
router.register(r"tas", TAViewSet)
router.register(r"ta-courses", TACourseRelViewSet)
router.register(r"homeworks", HomeworkViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"grading-assignments", GradingRelViewSet)

urlpatterns = [
  path("", include(router.urls)),
  path("homework/<int:hw_id>/tas/", TAAssignmentsForHomeworkView.as_view(), name="ta-assignments"),
  path("course-offering/<int:offering_id>/tas/", TAsForCourseView.as_view(), name="tas-for-course"),
  path("course-offering/<int:offering_id>/ta-stats/", CourseOfferingTAStats.as_view(), name="course-ta-stats"),
]