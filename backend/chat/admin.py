from django.contrib import admin
from .models import (
    Conversation,
    ConversationMessage,
    GroupChat,
    GroupChatMessage,
    GroupChatAdmin,
    Notification,
)

# Register your models here.

admin.site.register(Conversation)
admin.site.register(ConversationMessage)
admin.site.register(GroupChat)
admin.site.register(GroupChatMessage)
admin.site.register(GroupChatAdmin)
admin.site.register(Notification)
