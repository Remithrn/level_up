from django.db import models

import uuid
from accounts.models import CustomUserModel

User = CustomUserModel


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    users = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):

        return f"Conversation between {self.users.all().values_list('username', flat=True)}"


class ConversationMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    body = models.TextField()
    sent_to = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_messages"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.created_by.username} - {self.body}"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("CHAT", "Chat"),
        ("GROUP_CHAT", "Group Chat"),
    ]

    user = models.ForeignKey(
        User, related_name="notifications", on_delete=models.CASCADE
    )
    from_user = models.ForeignKey(
        User, related_name="sent_notifications", on_delete=models.CASCADE
    )
    message = models.CharField(max_length=255)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    conversation_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
    )


class GroupChat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    users = models.ManyToManyField(User, related_name="group_chats")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class GroupChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group_chat = models.ForeignKey(
        GroupChat, related_name="messages", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User, related_name="group_chat_messages", on_delete=models.CASCADE
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.message}"


class GroupChatAdmin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group_chat = models.ForeignKey(
        GroupChat, related_name="admins", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User, related_name="group_chat_admins", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.group_chat.name}"
