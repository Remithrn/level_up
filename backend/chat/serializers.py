from .models import GroupChat, GroupChatMessage
from rest_framework import serializers
from .models import Conversation, ConversationMessage, Notification, GroupChatAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(source="profiles.profile_picture")

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "profile_picture")


class ConversationListSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "users", "modified_at"]


class ConversationMessageSerializer(serializers.ModelSerializer):
    created_by = UserDetailSerializer(read_only=True)

    class Meta:
        model = ConversationMessage
        fields = ["id", "created_by", "body", "created_at"]


class ConversationDetailSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "users", "modified_at"]


class ConversationMessageSerializer(serializers.ModelSerializer):
    sent_to = UserDetailSerializer(many=False, read_only=True)
    created_by = UserDetailSerializer(many=False, read_only=True)

    class Meta:
        model = ConversationMessage
        fields = ["id", "created_by", "body", "created_at", "sent_to"]


class NotificationSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "message",
            "notification_type",
            "is_read",
            "created_at",
            "conversation_id",
            "from_user",
        ]

    def get_from_user(self, obj):
        return obj.from_user.username


class GroupChatAdminSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(many=False, read_only=True)

    class Meta:
        model = GroupChatAdmin
        fields = ["id", "group_chat", "user", "created_at"]


class GroupChatSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)
    admins = GroupChatAdminSerializer(many=True, read_only=True)

    class Meta:
        model = GroupChat
        fields = ["id", "name", "users", "created_at", "modified_at", "admins"]


class GroupChatMessageSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(many=False, read_only=True)
    admins = GroupChatAdminSerializer(many=True, read_only=True)

    class Meta:
        model = GroupChatMessage
        fields = ["id", "group_chat", "user", "message", "created_at", "admins"]
