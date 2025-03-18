from rest_framework import serializers
from .models import Course, CourseOffering, TA, TACourseRel, Homework, Question, GradingRel


class CourseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Course
    fields = "__all__"


class CourseOfferingSerializer(serializers.ModelSerializer):
  class Meta:
    model = CourseOffering
    fields = "__all__"


class TASerializer(serializers.ModelSerializer):
  class Meta:
    model = TA
    fields = "__all__"


class TACourseRelSerializer(serializers.ModelSerializer):
  class Meta:
    model = TACourseRel
    fields = "__all__"


class HomeworkSerializer(serializers.ModelSerializer):
  class Meta:
    model = Homework
    fields = "__all__"


class HWQuestionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Question
    fields = "__all__"


class GradingRelSerializer(serializers.ModelSerializer):
  class Meta:
    model = GradingRel
    fields = "__all__"