from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/<str:room_name>/", consumers.ChatConsumer.as_asgi()),
    path("ws/group-chat/<str:group_id>/", consumers.GroupChatConsumer.as_asgi()),
    path(
        "ws/notification/res/<int:user_id>/",
        consumers.NewNotificationConsumer.as_asgi(),
    ),
]
