from rest_framework import serializers
from .models import LeetcodeSubmission, DailyTasks, UserStreaks,Badges,UserBadges
from accounts.models import UserProfile,CustomUserModel
from django.db import models
from accounts.serializers import UserProfileSerializer

class LeetcodeSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeetcodeSubmission
        fields = '__all__'
class DailyTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTasks
        fields = '__all__'
class UserStreaksSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStreaks
        fields = '__all__'
class BadgesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badges
        fields = '__all__'

class UserBadgesSerializer(serializers.ModelSerializer):
    badge_name = serializers.CharField(source='badge.badge_name')
    badge_image = serializers.ImageField(source='badge.badge_image')
    badge_description = serializers.CharField(source='badge.badge_description')
    class Meta:
        model = UserBadges
        fields = ['id', 'user', 'badge', 'badge_name', 'badge_image', 'badge_description']

class LeaderboardFriendSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id')
    username = serializers.CharField(source='user.username')
    profile_picture = serializers.SerializerMethodField()
    experience_points = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['user_id', 'username', 'profile_picture', 'experience_points']

    def get_profile_picture(self, obj):
        return obj.profile_picture.url if obj.profile_picture else None
    def get_experience_points(self, obj):
        # Assuming a user can have multiple UserStreaks and we want the sum of experience_points
        return sum(streak.experience_points for streak in obj.user.userstreaks.all())



