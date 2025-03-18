from django.db import models

# Create your models here.

class Course(models.Model):
  dept = models.CharField(max_length=10)
  number = models.PositiveSmallIntegerField()
  title = models.CharField(max_length=100)

  class Meta:
    unique_together = ("dept", "number")
  
  def __str__(self):
    return f"{self.name} {self.number}"


class CourseOffering(models.Model):
  course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="offerings")
  semester = models.CharField(max_length=6)
  year = models.PositiveSmallIntegerField()

  class Meta:
    unique_together = ("course", "semester", "year")

  def __str__(self):
    return f"{self.course}, {self.semester} {self.year}"
  

class TA(models.Model):
  username = models.CharField(max_length=100, unique=True)
  first = models.CharField(max_length=100)
  last = models.CharField(max_length=100)

  def __str__(self):
    return self.username


class TACourseRel(models.Model):
  ta = models.ForeignKey(TA, on_delete=models.CASCADE, related_name="ta_course_rels")
  course_offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name="ta_course_rels")
  classification = models.CharField(max_length=2) # UG or GR

  class Meta:
    unique_together = ("ta", "course_offering")

  def __str__(self):
    return f"{self.ta}, {self.course_offering}"


class Homework(models.Model):
  hw_name = models.CharField(max_length=100)
  course_offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name="homeworks")

  def __str__(self):
    return f"{self.hw_name}, {self.course_offering}"


class Question(models.Model):
  hw = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name="questions")
  question_name = models.CharField(max_length=100)
  difficulty = models.PositiveSmallIntegerField()
  required_tas = models.PositiveSmallIntegerField() # gta + uta + either
  required_gtas = models.PositiveSmallIntegerField(default=0)
  required_utas = models.PositiveSmallIntegerField(default=0)

  def __str__(self):
    return f"{self.hw}, {self.question_name}"


class GradingRel(models.Model):
  ta = models.ForeignKey(TA, on_delete=models.CASCADE, related_name="grading")
  question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="grading")

  class Meta:
    unique_together = ("ta", "question")

  def __str__(self):
    return f"{self.ta}, {self.question}"