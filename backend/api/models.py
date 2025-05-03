from django.db import models

# Create your models here.

class Course(models.Model):
  dept = models.CharField(max_length=10)
  number = models.CharField(max_length=50)
  title = models.CharField(max_length=100)

  class Meta:
    unique_together = ("dept", "number")
  
  def __str__(self):
    return f"{self.dept} {self.number}"


class CourseOffering(models.Model):
  course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="offerings", db_index=True)
  semester = models.CharField(max_length=6, choices=(
    ("Spring", "Spring"),
    ("Summer", "Summer"),
    ("Fall", "Fall"),
    ("Winter", "Winter")
  ))
  year = models.PositiveSmallIntegerField()

  class Meta:
    unique_together = ("course", "semester", "year")

  def __str__(self):
    return f"{self.course}, {self.semester} {self.year}"
  

class TA(models.Model):
  username = models.CharField(max_length=50, unique=True)
  first = models.CharField(max_length=50)
  last = models.CharField(max_length=50)

  class Meta:
    indexes = [
      # Index for grouping in TA stats query
      models.Index(fields=["id", "username", "first", "last"]),
    ]

  def __str__(self):
    return self.username


class TACourseRel(models.Model):
  ta = models.ForeignKey(TA, on_delete=models.CASCADE, related_name="ta_course_rels")
  course_offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name="ta_course_rels", db_index=True)
  classification = models.CharField(max_length=2, choices=(
    ("UG", "Undergraduate"),
    ("GR", "Graduate")
  ))

  class Meta:
    unique_together = ("ta", "course_offering")

  def __str__(self):
    return f"{self.ta}, {self.course_offering}"


class Homework(models.Model):
  hw_name = models.CharField(max_length=50)
  course_offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name="homeworks", db_index=True)

  class Meta:
    unique_together = ("hw_name", "course_offering")

  def __str__(self):
    return f"{self.hw_name}, {self.course_offering}"


class Question(models.Model):
  hw = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name="questions", db_index=True)
  question_name = models.CharField(max_length=50)
  difficulty = models.PositiveSmallIntegerField()
  required_tas = models.PositiveSmallIntegerField() # gta + uta + either
  required_gtas = models.PositiveSmallIntegerField(default=0)
  required_utas = models.PositiveSmallIntegerField(default=0)

  class Meta:
    unique_together = ("hw", "question_name")

  def __str__(self):
    return f"{self.hw}, {self.question_name}"


class GradingRel(models.Model):
  ta = models.ForeignKey(TA, on_delete=models.CASCADE, related_name="grading")
  question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="grading", db_index=True)

  class Meta:
    unique_together = ("ta", "question")

  def __str__(self):
    return f"{self.ta}, {self.question}"