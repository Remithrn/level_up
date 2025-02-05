import json
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from .models import ConversationMessage, GroupChatMessage, GroupChat
from accounts.models import CustomUserModel


class NewNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Connect the authenticated user to their notification group.
        """
        print("New Notification Connection Attempt")
        user = self.scope["user"]

        if not user.is_authenticated:
            print("Unauthenticated User - Closing Connection")
            await self.close()
            return

        self.user = user
        self.group_name = f"user_notifications_{self.user.id}"

        try:
            # Add the user to their notification group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name,
            )
            print(f"User added to group: {self.group_name}")
            await self.accept()
            print("Connection Accepted")
        except Exception as e:
            print(f"Connection Error: {e}")
            await self.close()

    async def disconnect(self, close_code):
        """
        Remove the user from their notification group on disconnect.
        """
        print(f"Disconnecting...{close_code}")
        try:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )
            print(f"User removed from group: {self.group_name}")
        except Exception as e:
            print(f"Disconnection Error: {e}")
        print("Disconnected")

    async def notif(self, event):
        """
        Send a notification to the user when their group receives an event.
        """
        print(f"Event Received: {event}")
        try:
            await self.send(
                text_data=json.dumps(
                    {
                        "message": event.get("message"),
                        "type": event.get("type"),
                    }
                )
            )
            print("Notification Sent")
        except Exception as e:
            print(f"Sending Notification Error: {e}")

    async def receive(self, text_data):
        """
        Process messages received from the WebSocket (if needed).
        """
        print(f"Message Received: {text_data}")
        data = json.loads(text_data)

        # Example: Mark all notifications as read
        if data.get("action") == "mark_read":
            await self.mark_notifications_as_read()

        if data.get("action") == "mark_single_read" and "conversation_id" in data:
            conversation_id = data["conversation_id"]
            await self.mark_single_notification_as_read(conversation_id)

    @sync_to_async
    def mark_notifications_as_read(self):
        """
        Mark all unread notifications for the user as read.
        """
        self.user.notifications.filter(is_read=False).update(is_read=True)
        print(f"Marked all notifications as read for user {self.user.username}")

    @sync_to_async
    def mark_single_notification_as_read(self, conversation_id):
        """
        Mark a specific notification as read based on conversation ID.
        """
        self.user.notifications.filter(
            is_read=False, conversation_id=conversation_id
        ).update(is_read=True)
        print(f"Marked notification as read for conversation ID: {conversation_id}")



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Chat Connection Attempt")
        # if user in scope is anonymous user then close the connection
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        try:
            conversation_id = data["data"]["conversation_id"]
            sent_to_id = data["data"]["sent_to_id"]
            name = data["data"]["name"]
            body = data["data"]["body"]
            user = data["data"]["user"]
        except:
            pass
        # print(user, "******************************")
        try:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "body": body,
                    "name": name,
                    "user": user,
                },
            )
            await self.save_message(body, conversation_id, sent_to_id, user)
        except:
            pass

    async def chat_message(self, event):
        print("sending message")
        body = event["body"]
        name = event["name"]

        await self.send(
            text_data=json.dumps(
                {
                    "body": body,
                    "name": name,
                }
            )
        )

    # save message to database
    @sync_to_async
    def save_message(self, body, conversation_id, sent_to_id, user):
        user = self.scope["user"]
        print(user, "******************************")
        ConversationMessage.objects.create(
            body=body,
            conversation_id=conversation_id,
            sent_to_id=sent_to_id,
            created_by=user,
        )


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["group_id"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()  # Accept the WebSocket connection

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        group_id = data["data"]["group_id"]
        body = data["data"]["message"]
        user = self.scope["user"]

        # Check if the user is a member of the group
        if not await self.is_user_member(user, group_id):
            await self.send(
                text_data=json.dumps(
                    {
                        "error": "You are not a member of this group and cannot send messages."
                    }
                )
            )
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "body": body,
                "user": user.username,  # Include the username in the message
            },
        )
        await self.save_message(body, group_id, user)

    async def chat_message(self, event):
        body = event["body"]
        user = event["user"]

        await self.send(
            text_data=json.dumps(
                {
                    "body": body,
                    "user": user,
                }
            )
        )

    @sync_to_async
    def save_message(self, body, group_id, user):
        group_chat = GroupChat.objects.get(id=group_id)
        GroupChatMessage.objects.create(group_chat=group_chat, user=user, message=body)

    @sync_to_async
    def is_user_member(self, user, group_id):
        return GroupChat.objects.filter(id=group_id, users=user).exists()
