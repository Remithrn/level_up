from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError


Usser = get_user_model()
# Create your models here.
class MockInterview(models.Model):
    questions = models.JSONField()
    answers = models.JSONField(null=True, blank=True)
    JobPosition = models.CharField(max_length=255)
    JobDescription = models.TextField()
    JobExperience = models.IntegerField()
    created_by = models.ForeignKey(Usser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mockId = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def clean(self):
        super().clean()
        if self.job_experience < 1 or self.job_experience > 20:
            raise ValidationError('Job experience must be between 1 and 20.')
    def __str__(self) -> str:
        return str(self.mockId)
        
    #after saving return mockId
    def save(self, *args, **kwargs):
        # Save the instance to the database
        super().save(*args, **kwargs)
        # Return the mock_id after saving
        return self.mockId

class Feedback(models.Model):
    mock_interview = models.ForeignKey(MockInterview, on_delete=models.CASCADE)
    feedback = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.mock_interview)

#ai quiz model multiple choice answers
class Quiz(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    creator = models.ForeignKey(Usser, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255, blank=True, null=True)
    quiz = models.JSONField()
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Quiz {self.id} - {self.topic}"
    
    

    

