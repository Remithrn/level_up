from django.db import models
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.utils import timezone
# Create your models here.
User = get_user_model()
class LeetcodeSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_number = models.IntegerField()
    question_title = models.CharField(max_length=255)
    question_link = models.URLField()
    language = models.CharField(max_length=255)
    code = models.TextField()
    submission_date = models.DateTimeField(auto_now_add=True)
    submission_time = models.TimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.question_title} - {self.submission_date}"


class UserStreaks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='userstreaks')
    streak_start_date = models.DateField(null=True,blank=True,default=timezone.now)
    streak_end_date = models.DateField(null=True,blank=True,default=timezone.now)
    streak_length = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    experience_points = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user.username} - {self.streak_start_date} - {self.streak_end_date}"
    def increase_streak_length(self):
        self.streak_length += 1
        self.streak_end_date = self.streak_end_date + timedelta(days=1)
        self.save()
        print("Streak length increased to:", self.streak_length)

        # Check if streak badge threshold is met
        try:
            print("Checking streak badge threshold...")
            # Retrieve the badge that corresponds to the 'streak' type
            badge =  Badges.objects.get(badge_type='streak')
            if self.streak_length >= badge.threshold:
                userBadge = UserBadges.objects.get_or_create(user=self.user, badge=badge)
                userBadge.save()

        
        except Exception as e:
            # Handle other exceptions
            print("Error checking streak badge threshold:", str(e))


class DailyTasks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    leetcodeTask = models.BooleanField(default=False)
    aiInterviewTask = models.BooleanField(default=False)
    aiQuizTask = models.BooleanField(default=False)
    date = models.DateField(blank=True,null=True)
    class Meta:
        unique_together = ('user', 'date')
    def __str__(self):
        return f"{self.user.username} - {self.user}"

class Badges(models.Model):
    types = (
        ('streak','Streak'),
        ('experience','Experience'),
    )
    badge_name = models.CharField(max_length=255)
    badge_type = models.CharField(max_length=255,choices=types)
    badge_threshold = models.IntegerField()
    badge_description = models.TextField()
    badge_image = models.ImageField(upload_to='badges/')
    def __str__(self):
        return f"{self.badge_type} - {self.badge_name}"
    
class UserBadges(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badges, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.user.username} - {self.badge.badge_name}"