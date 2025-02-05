from .models import UserChatHistory
from rest_framework import serializers

class UserChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserChatHistory
        fields = '__all__'