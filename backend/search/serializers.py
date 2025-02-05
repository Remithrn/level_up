from rest_framework import serializers
from accounts.models import  FriendRequest, UserProfile,CustomUserModel
from django.contrib.auth import get_user_model
User= get_user_model()
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = UserProfile

        fields = ['bio', 'profile_picture', 'streak_count', 'last_activity_date', 'banner','username']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    request_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'request_status']

    def get_request_status(self, user):
        request_user = self.context['request'].user
        print(request_user,"req")
        
        
        if request_user.is_authenticated:
            if FriendRequest.objects.filter(from_user=request_user,to_user =user,accepted=True):
                return 'friend'
            elif FriendRequest.objects.filter(from_user=user, to_user=request_user,accepted =True):
                return 'friend'
            elif FriendRequest.objects.filter(from_user=request_user, to_user=user).exists():
                return 'sent'
            # elif request_user in user.userprofile.friends.all():
            #     return 'friend'
            elif FriendRequest.objects.filter(from_user=user, to_user=request_user).exists():
                return 'received'
            
        return 'none'


class FriendSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.ImageField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)


    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'username', 'profile_picture', 'user_id']

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user_username = serializers.CharField(source='from_user.username', read_only=True)
    from_user_email = serializers.EmailField(source='from_user.email', read_only=True)
    from_user_profile_picture = serializers.ImageField(source='from_user.userprofile.profile_picture', read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    from_user_id = serializers.IntegerField(source='from_user.id', read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user_username', 'from_user_email', 'from_user_profile_picture', 'timestamp', 'from_user_id']