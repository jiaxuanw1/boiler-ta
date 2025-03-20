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


class TAAssignmentSerializer(serializers.ModelSerializer):
  question_id = serializers.IntegerField(source="question.id")
  ta_id = serializers.IntegerField(source="ta.id")
  ta_username = serializers.CharField(source="ta.username")
  ta_first = serializers.CharField(source="ta.first")
  ta_last = serializers.CharField(source="ta.last")

  class Meta:
    model = GradingRel
    fields = ["id", "question_id", "ta_id", "ta_username", "ta_first", "ta_last"]


class TAsForCourseSerializer(serializers.ModelSerializer):
  ta_id = serializers.IntegerField(source="ta.id")
  ta_username = serializers.CharField(source="ta.username")
  ta_first = serializers.CharField(source="ta.first")
  ta_last = serializers.CharField(source="ta.last")
  classification = serializers.CharField(source="get_classification_display") # human-readable choice

  class Meta:
    model = TACourseRel
    fields = ["id", "ta_id", "ta_username", "ta_first", "ta_last", "classification"]
