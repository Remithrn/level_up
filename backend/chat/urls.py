from django.urls import path
from . import api
from .views import NotificationViewSet
from rest_framework.routers import DefaultRouter
from .views import GroupChatViewSet,GroupChatMessageViewSet
router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'group-chats', GroupChatViewSet, basename='group-chats')
router.register(r'group-chat-messages', GroupChatMessageViewSet, basename='group-chat-messages')

urlpatterns = [
    path('', api.conversation_list, name='api_conversations_list'),
    path('<uuid:pk>/', api.conversation_detail, name='api_conversation_detail'),
    path('start/<int:user_id>/', api.conversation_start, name='api_conversation_start'),
  
    path('group-chats/<uuid:pk>/', api.group_chat_detail, name='api_group_chat_detail'),
    path('group-chats/<uuid:pk>/remove-member/', api.group_chat_remove_member, name='api_group_chat_remove_member'),
    path('group-chats/<uuid:pk>/add-member/', api.group_chat_add_member, name='api_group_chat_add_member'),
]

urlpatterns += router.urls

