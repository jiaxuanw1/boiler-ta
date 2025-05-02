from django.db import connection, transaction
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
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
  TAsForCourseSerializer,
  QuestionTAAssignmentBulkUpdateSerializer
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

  @action(detail=True, methods=['post'])
  def update_ta_assignments(self, request, pk=None):
    question = self.get_object()
    serializer = QuestionTAAssignmentBulkUpdateSerializer(data={
      'question_id': question.id,
      'ta_ids': request.data.get('ta_ids', [])
    })
        
    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    try:
      with transaction.atomic():
        # Get current assignments
        current_assignments = set(
          GradingRel.objects.filter(question=question)
          .values_list('ta_id', flat=True)
        )
        new_assignments = set(serializer.validated_data['ta_ids'])
                
        # Add new assignments
        to_add = new_assignments - current_assignments
        for ta_id in to_add:
          GradingRel.objects.create(ta_id=ta_id, question=question)
                
        # Remove old assignments
        to_remove = current_assignments - new_assignments
        if to_remove:
          GradingRel.objects.filter(
            question=question,
            ta_id__in=to_remove
          ).delete()
                
        if (len(new_assignments) < question.required_tas):
          raise Exception("TA assignments don't meet requirements for this question")
                
        return Response(status=status.HTTP_200_OK)
            
    except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


class CourseOfferingTAStats(APIView):
  def get(self, request, offering_id):
    try:
      with connection.cursor() as cursor:
        query = """
          SELECT 
            t.username AS username, 
            t.first AS first, 
            t.last AS last, 
            COALESCE(SUM(difficulty), 0) AS total_difficulty,
            COALESCE(AVG(difficulty), 0) AS avg_difficulty,
            COUNT(question_id) AS assignment_count
          FROM api_courseoffering co
            JOIN api_tacourserel tcrel ON co.id = tcrel.course_offering_id
            JOIN api_ta t ON tcrel.ta_id = t.id
            LEFT OUTER JOIN (
                SELECT ta_id, difficulty, question_id
                FROM api_gradingrel grel
                  JOIN api_question q ON grel.question_id = q.id
                  JOIN api_homework h ON q.hw_id = h.id
                WHERE h.course_offering_id = %s
            ) g ON t.id = g.ta_id
          WHERE tcrel.course_offering_id = %s
          GROUP BY t.id, t.username, t.first, t.last
          ORDER BY total_difficulty DESC;
        """
        cursor.execute(query, [offering_id, offering_id])
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

      return Response(results, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)