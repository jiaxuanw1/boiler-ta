from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Course, CourseOffering, TA, TACourseRel, Homework, Question, GradingRel
from .serializers import (
  CourseSerializer,
  CourseOfferingSerializer,
  TASerializer,
  TACourseRelSerializer,
  HomeworkSerializer,
  HWQuestionSerializer,
  GradingRelSerializer,
  TAAssignmentSerializer,
  TAsForCourseSerializer
)

# Create your views here.

class CourseViewSet(viewsets.ModelViewSet):
  queryset = Course.objects.all()
  serializer_class = CourseSerializer


class CourseOfferingViewSet(viewsets.ModelViewSet):
  queryset = CourseOffering.objects.all()
  serializer_class = CourseOfferingSerializer
  filterset_fields = ["course"]


class TAViewSet(viewsets.ModelViewSet):
  queryset = TA.objects.all()
  serializer_class = TASerializer


class TACourseRelViewSet(viewsets.ModelViewSet):
  queryset = TACourseRel.objects.all()
  serializer_class = TACourseRelSerializer
  filterset_fields = ["course_offering"]


class HomeworkViewSet(viewsets.ModelViewSet):
  queryset = Homework.objects.all()
  serializer_class = HomeworkSerializer
  filterset_fields = ["course_offering"]


class QuestionViewSet(viewsets.ModelViewSet):
  queryset = Question.objects.all()
  serializer_class = HWQuestionSerializer
  filterset_fields = ["hw"]


class GradingRelViewSet(viewsets.ModelViewSet):
  queryset = GradingRel.objects.all()
  serializer_class = GradingRelSerializer


class TAAssignmentsForHomeworkView(APIView):
  def get(self, request, hw_id):
    try:
      # Filter and perform join
      ta_assignments = GradingRel.objects.filter(
        question__hw_id=hw_id
      ).select_related("ta", "question")
      
      # Serialize results
      serializer = TAAssignmentSerializer(ta_assignments, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

class TAsForCourseView(APIView):
  def get(self, request, offering_id):
    try:
      # Filter and join
      tas_for_course = TACourseRel.objects.filter(course_offering_id=offering_id).select_related("ta")

      # Serialize results
      serializer = TAsForCourseSerializer(tas_for_course, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
