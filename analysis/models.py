from django.db import models

# Create your models here.
from django.db import models

class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True)
    analysis_result = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.file.name


from django.db import models
from django.contrib.auth.models import User

class Skill(models.Model):
    name = models.CharField(max_length=100)
    importance = models.CharField(max_length=10, choices=[('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')])
    demand_score = models.IntegerField()

    def __str__(self):
        return self.name

class Course(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    rating = models.FloatField()
    students = models.CharField(max_length=50)
    price = models.CharField(max_length=50)
    level = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    current_level = models.IntegerField(default=0)
    required_level = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}"



from django.db import models

class ResumeAnalysis(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('processing', 'Processing'),
        ('failed', 'Failed'),
    ]

    file_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)

    ats_score = models.IntegerField(null=True, blank=True)
    clarity_score = models.IntegerField(null=True, blank=True)
    skills_match = models.JSONField(null=True, blank=True) 
    job_matches = models.IntegerField(null=True, blank=True)

    experience = models.TextField(null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    strengths = models.JSONField(null=True, blank=True)
    weaknesses = models.JSONField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    trend = models.CharField(max_length=20, default='neutral')
    previous_score = models.IntegerField(default=0)

    def __str__(self):
        return self.file_name
