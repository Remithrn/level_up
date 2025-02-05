# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUserModel, UserProfile

@receiver(post_save, sender=CustomUserModel)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
