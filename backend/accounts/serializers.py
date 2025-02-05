from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import CustomUserModel, UserProfile, FriendRequest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from backend_site.serializers import BaseSerializer
from django.conf import settings

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)
    username = serializers.CharField(max_length=100, required=True)

    def save(self, request):
        user = super().save(request)
        
        # Use self.validated_data instead of self.data to get the values
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.username = self.validated_data.get('username', '')

        # Ensure that all fields are set correctly
        if not user.first_name:
            raise serializers.ValidationError({"first_name": "This field is required."})
        if not user.last_name:
            raise serializers.ValidationError({"last_name": "This field is required."})
        if not user.username:
            raise serializers.ValidationError({"username": "This field is required."})

        user.save()
        return user



User = get_user_model()

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = serializers.StringRelatedField()

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'timestamp']

class FriendProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    friends_count = serializers.SerializerMethodField()
    streak_count = serializers.IntegerField(read_only=True)
    last_activity_date = serializers.DateField(read_only=True)
    banner = serializers.ImageField(read_only=True)
    request_status = serializers.SerializerMethodField()
    friend_id = serializers.IntegerField(source='user.id')

    class Meta:
        model = UserProfile
        fields = [
            'username', 'email', 'first_name', 'last_name', 'bio', 
            'profile_picture', 'friends_count', 'streak_count', 
            'last_activity_date', 'banner', 'request_status', 'friend_id'
        ]

    # Method to get the count of friends
    def get_friends_count(self, obj):
        return obj.friends.count()

    # Method to determine the relationship status
    def get_request_status(self, obj):
        request_user = self.context['request'].user

        if request_user.is_authenticated:
            # Check if they are already friends (using 'user__id' to filter)
            if obj.friends.filter(user__id=request_user.id).exists():
                return 'friend'

            # Check if the request_user has sent a friend request to obj.user
            if FriendRequest.objects.filter(from_user=request_user, to_user=obj.user, accepted=False).exists():
                return 'sent'

            # Check if the request_user has received a friend request from obj.user
            if FriendRequest.objects.filter(from_user=obj.user, to_user=request_user, accepted=False).exists():
                return 'received'

        # If none of the conditions match, return 'none'
        return 'none'

class UserProfileSerializer(BaseSerializer):
    username = serializers.CharField(source='user.username')  # Editable username
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    ai_tokens = serializers.IntegerField(source='user.ai_tokens',read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    friends_count = serializers.SerializerMethodField()
    friend_requests = serializers.SerializerMethodField()
    streak_count = serializers.IntegerField(read_only=True)
    last_activity_date = serializers.DateField(read_only=True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    subscription_status = serializers.BooleanField(source='user.subscription_status', read_only=True)
    
    def get_profile_picture_url(self):
        print("Profile Picture URL:", self.profile_picture.url)
        if self.profile_picture:
            return f'http://localhost{settings.MEDIA_URL}{self.profile_picture.name}'
        return None

    def get_banner_url(self):
        print("Banner URL:", self.banner.url)
        if self.banner:
            return f'http://localhost{settings.MEDIA_URL}{self.banner.name}'
        return None

    

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'first_name', 'last_name', 'bio', 'profile_picture', 
                  'banner', 'streak_count', 'last_activity_date', 'friends_count', 'friend_requests','ai_tokens','subscription_status', 'is_active','is_staff']

    # Method to get the count of friends
    def get_friends_count(self, obj):
        return obj.friends.count()

    # Method to get pending friend requests
    def get_friend_requests(self, obj):
        requests = FriendRequest.objects.filter(to_user=obj.user, accepted=False)
        return FriendRequestSerializer(requests, many=True).data

    # Validator for username uniqueness
    def validate_username(self, value):
        user = self.instance.user  # Get the user instance
        if User.objects.filter(username=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def update(self, instance, validated_data):
        # Extract user data if present
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user model fields (username, first_name, last_name)
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update the profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ['username', 'email', 'first_name', 'last_name','is_staff']

    def validate_username(self, value):
        if User.objects.filter(username=value).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise ValidationError("A user with that username already exists.")
        return value
