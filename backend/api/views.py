from django.shortcuts import render
from rest_framework import viewsets
from .models import Course, CourseOffering, TA, TACourseRel, Homework, Question, GradingRel
from .serializers import (
  CourseSerializer,
  CourseOfferingSerializer,
  TASerializer,
  TACourseRelSerializer,
  HomeworkSerializer,
  HWQuestionSerializer,
  GradingRelSerializer
)

# Create your views here.

class CourseViewSet(viewsets.ModelViewSet):
  queryset = Course.objects.all()
  serializer_class = CourseSerializer


class CourseOfferingViewSet(viewsets.ModelViewSet):
  queryset = CourseOffering.objects.all()
  serializer_class = CourseOfferingSerializer


class TAViewSet(viewsets.ModelViewSet):
  queryset = TA.objects.all()
  serializer_class = TASerializer


class TACourseRelViewSet(viewsets.ModelViewSet):
  queryset = TACourseRel.objects.all()
  serializer_class = TACourseRelSerializer


class HomeworkViewSet(viewsets.ModelViewSet):
  queryset = Homework.objects.all()
  serializer_class = HomeworkSerializer


class QuestionViewSet(viewsets.ModelViewSet):
  queryset = Question.objects.all()
  serializer_class = HWQuestionSerializer


class GradingRelViewSet(viewsets.ModelViewSet):
  queryset = GradingRel.objects.all()
  serializer_class = GradingRelSerializer
