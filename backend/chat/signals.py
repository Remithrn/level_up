from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Conversation, ConversationMessage, Notification, GroupChatMessage


@receiver(post_save, sender=ConversationMessage)
def message_created(sender, instance, created, **kwargs):
    if created:
        print("Signal triggered - Message created")
        try:
            # Create a new Notification
            Notification.objects.create(
                user=instance.sent_to,  # Recipient
                from_user=instance.created_by,  # Sender
                message=f"{instance.body}",
                conversation_id=f"{instance.conversation.id}",
                notification_type="CHAT",
            )
            print("Notification created")

            # Send notification via WebSocket
            channel_layer = get_channel_layer()
            group_name = (
                f"user_notifications_{instance.sent_to.id}"  # Group based on user ID
            )
            event = {
                "type": "notif",
                "message": {
                    "conversation_id": f"{instance.conversation.id}",
                    "body": instance.body,
                    "from_user": instance.created_by.username,
                    "notification_type": "CHAT",
                },
            }
            async_to_sync(channel_layer.group_send)(group_name, event)
            print("Notification sent via WebSocket")
        except Exception as e:
            print(f"Error in message_created signal: {e}")


@receiver(post_save, sender=GroupChatMessage)
def group_message_created(sender, instance, created, **kwargs):
    if created:
        print("Signal triggered - Group message created")
        try:
            # Retrieve group members excluding the sender
            group_members = instance.group_chat.users.exclude(id=instance.user.id)
            channel_layer = get_channel_layer()

            for member in group_members:
                # Create a new Notification
                Notification.objects.create(
                    user=member,  # Recipient
                    from_user=instance.user,  # Sender
                    message=f"{instance.message}",
                    conversation_id=f"{instance.group_chat.id}",
                    notification_type="GROUP_CHAT",
                )
                print(f"Notification created for {member.username}")

                # Send notification via WebSocket
                group_name = f"user_notifications_{member.id}"  # Group based on user ID
                event = {
                    "type": "notif",
                    "message": {
                        "conversation_id": f"{instance.group_chat.id}",
                        "body": instance.message,
                        "from_user": instance.user.username,
                        "notification_type": "GROUP_CHAT",
                    },
                }
                async_to_sync(channel_layer.group_send)(group_name, event)
                print(f"Notification sent via WebSocket to {member.username}")

        except Exception as e:
            print(f"Error in group_message_created signal: {e}")
