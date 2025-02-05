from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.utils import timezone
from django_resized import ResizedImageField
#import settings
from django.conf import settings

# Create your models here.
class CustomUserModel(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("Email Address"), unique=True, max_length=255)
    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    username = models.CharField(_("Username"), unique=True, max_length=200)
    subscription_status = models.BooleanField(default=False)
    ai_tokens = models.IntegerField(default=200)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "username"]

    objects = CustomUserManager()

    def __str__(self) -> str:
        return self.email


# User Profile Model
class UserProfile(models.Model):
    user = models.OneToOneField(
        CustomUserModel,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="profiles",
    )
    bio = models.TextField(blank=True, null=True)
    profile_picture = ResizedImageField(
        force_format="WEBP",
        quality=75,
        upload_to="profile_pictures/",
        blank=True,
        null=True,
    )
    streak_count = models.IntegerField(default=0)
    last_activity_date = models.DateField(blank=True, null=True)
    banner = ResizedImageField(
        force_format="WEBP", quality=100, upload_to="banner/", blank=True, null=True
    )
    friends = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


# friend request model
class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        CustomUserModel, related_name="sent_requests", on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        CustomUserModel, related_name="received_requests", on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField(default=timezone.now)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return (
            f"Friend request from {self.from_user.username} to {self.to_user.username}"
        )

    class Meta:
        unique_together = ("from_user", "to_user")
