from rest_framework import serializers,generics
from accounts.models import UserProfile
from streaks.serializers import UserStreaksSerializer
from rest_framework import serializers
from accounts.models import UserProfile
from streaks.models import UserStreaks
from payments.models import Transaction
from django.db.models import Sum

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')  # Editable username
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    ai_tokens = serializers.IntegerField(source='user.ai_tokens', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    streak_count = serializers.IntegerField(read_only=True)
    last_activity_date = serializers.DateField(read_only=True)
    subscription_status = serializers.BooleanField(source='user.subscription_status', read_only=True)
    streak_length = serializers.SerializerMethodField()
    experience_points = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'username', 'email', 'first_name', 'last_name', 'bio',
            'profile_picture', 'streak_count', 'last_activity_date',
            'ai_tokens', 'subscription_status', 'is_active', 'streak_length', 'experience_points'
        ]

    def get_streak_length(self, obj):
        # Fetch the streak length from the UserStreaks model
        streak = UserStreaks.objects.filter(user=obj.user).first()
        return streak.streak_length if streak else 0
    def get_experience_points(self, obj):
        # Fetch the streak length from the UserStreaks model
        streak = UserStreaks.objects.filter(user=obj.user).first()
        return streak.experience_points if streak else 0


class SalesDetailsSerializers(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    total_sales = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'payment_id', 'order_id', 'total_sales']

    def get_total_sales(self, obj):
        # This will now return the total sales only if it's already calculated
        return self.context.get('total_sales', 0)
