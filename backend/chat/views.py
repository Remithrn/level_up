from django.shortcuts import render
from .models import (
    Conversation,
    ConversationMessage,
    Notification,
    GroupChat,
    GroupChatMessage,
    GroupChatAdmin,
)
from .serializers import (
    NotificationSerializer,
    GroupChatSerializer,
    GroupChatMessageSerializer,
    GroupChatAdminSerializer,
)
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Max

User = get_user_model()


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user

        # Get the latest notification per conversation for the user
        latest_notifications = (
            Notification.objects.filter(user=user, is_read=False)
            .values("conversation_id")
            .annotate(latest_id=Max("id"))
        )
        return Notification.objects.filter(
            id__in=[n["latest_id"] for n in latest_notifications]
        )

    @action(detail=False, methods=["get"])
    def unread(self, request):
        user = self.request.user
        unread_notifications = self.get_queryset()
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        # Mark a specific notification as read
        try:
            notification = self.get_object()
            notification.is_read = True
            notification.save()
            serializer = self.get_serializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# Create your views here.
class GroupChatViewSet(viewsets.ModelViewSet):
    queryset = GroupChat.objects.all()
    serializer_class = GroupChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # only get group chats that the user is in
        user = self.request.user
        return GroupChat.objects.filter(users=user)

    def create(self, request, *args, **kwargs):
        group_name = request.data.get("name")
        description = request.data.get("description")
        user = request.user
        user_ids = request.data.get("user_ids")
        print(f"{group_name}-g {description}-d {user}-u {user_ids}-ui")
        users = User.objects.filter(id__in=user_ids)
        print(f"{users}-users")
        if not group_name:
            return Response(
                {"error": "Group name is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        group = GroupChat.objects.create(name=group_name, description=description)
        group.users.add(user)
        for user in users:
            group.users.add(user)
        print(f"{group}-g")
        admin = GroupChatAdmin.objects.create(group_chat=group, user=user)

        serializer = self.get_serializer(group)
        return Response({"group_chat": serializer.data}, status=status.HTTP_201_CREATED)


class GroupChatMessageViewSet(viewsets.ModelViewSet):
    queryset = GroupChatMessage.objects.all()
    serializer_class = GroupChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return GroupChatMessage.objects.filter(user=user)
