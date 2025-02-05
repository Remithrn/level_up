from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from .models import UserChatHistory  # Ensure you create this model to store chat history
import google.generativeai as genai
from .serializers import UserChatHistorySerializer

genai.configure(api_key=settings.GOOGLE_API_KEY)
# Function to count tokens (simple implementation, adjust as needed)
def count_tokens(text):
    return len(text.split())

class AIChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get("message")

        if not user_message:
            return Response(
                {"error": "Message field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Retrieve the last few chat history for the user
            chat_history = UserChatHistory.objects.filter(user=request.user).order_by('-timestamp')
            previous_chats = []

            # Build previous chats while keeping track of token count
            total_tokens = 0
            for chat in chat_history:
                user_tokens = count_tokens(chat.user_message)
                ai_tokens = count_tokens(chat.ai_response)
                
                if total_tokens + user_tokens + ai_tokens > 30000:
                    break
                
                previous_chats.append(f"User: {chat.user_message}\nAI: {chat.ai_response}")
                total_tokens += user_tokens + ai_tokens
            
            previous_chats.reverse()  # Reorder for chronological context

            # Build the prompt with limited context
            prompt = (
                "You are an AI coding assistant. your name is UpBot, Help the user with their coding questions. don't  answer any question that is not related to coding. "
                "Here is the context of the conversation:\n"
                f"{'\n'.join(previous_chats)}\n"
                f"User: {user_message}\nAI:"
            )

            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            ai_response = response.text.strip()

            # Save the current chat interaction
            chat_history = UserChatHistory(
                user=request.user,
                user_message=user_message,
                ai_response=ai_response
            )
            chat_history.save()

            return Response(
                {"response": ai_response},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Error in AI chatbot: {e}")
            return Response(
                {"error": "An error occurred while processing your request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chat_history = UserChatHistory.objects.filter(user=request.user).order_by('timestamp')
        serializer = UserChatHistorySerializer(chat_history, many=True)
        return Response({"messages": serializer.data})
