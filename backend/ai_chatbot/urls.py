from django.urls import path
from .views import AIChatbotView,ChatHistoryView
urlpatterns = [
    path('chat/', AIChatbotView.as_view(), name='ai_chatbot'),
    path('chat-history/', ChatHistoryView.as_view(), name='chat-history'),
]