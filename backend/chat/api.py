from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from .models import Conversation, ConversationMessage,GroupChat,GroupChatMessage,GroupChatAdmin
from django.contrib.auth import get_user_model

from .serializers import ConversationListSerializer, ConversationMessageSerializer, ConversationDetailSerializer,GroupChatSerializer,GroupChatMessageSerializer
from django.db.models import Max
User = get_user_model()
@api_view(['GET'])
def conversation_list(request):
    #order by last updated
    conversations = request.user.conversations.all().annotate(
        latest_message_time=Max('messages__created_at')
    ).order_by('-latest_message_time') 
    serializer = ConversationListSerializer(conversations,many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def conversation_detail(request, pk):
    conversation = get_object_or_404(Conversation, pk=pk)
    conversation_serializer = ConversationDetailSerializer(conversation,many=False)
    messages_serializer = ConversationMessageSerializer(conversation.messages.all(),many=True)
    return JsonResponse({"conversation":conversation_serializer.data,"messages":messages_serializer.data},safe=False)

@api_view(['GET'])
def conversation_start(request,user_id):
    conversation = Conversation.objects.filter(users__in=[user_id]).filter(users__in=[request.user.id])
    if conversation.count()>0:
        conversation = conversation.first()

        return JsonResponse({"success":True,"conversation_id":conversation.id},safe=False)
    else:
        user = get_object_or_404(User,pk=user_id)
        conversation = Conversation.objects.create()
        conversation.users.add(request.user)
        conversation.users.add(user)
        conversation.save()
        return JsonResponse({"success":True,"conversation_id":conversation.id},safe=False)
    
@api_view(['GET'])
def group_chat_list(request):
    group_chats = GroupChat.objects.all().annotate(
        latest_message_time=Max('group_chat_messages__created_at')
    ).order_by('-latest_message_time')
    serializer = GroupChatSerializer(group_chats, many=True)
    admin = GroupChatAdmin.objects.filter(group_chat__in=group_chats,user=request.user)
    return JsonResponse({"group_chats":serializer.data,"admin":admin.data},safe=False)

@api_view(['GET'])
def group_chat_detail(request, pk):
    group_chat = get_object_or_404(GroupChat, pk=pk)
    serializer = GroupChatSerializer(group_chat, many=False)
    messages_serializer = GroupChatMessageSerializer(group_chat.messages.all(),many=True)
    return JsonResponse({"group_chat":serializer.data,"messages":messages_serializer.data},safe=False)

@api_view(['POST'])
def group_chat_add_member(request,pk):
    user_ids = request.data.get('user_ids')
    group_chat = get_object_or_404(GroupChat, id=pk)
    if user_ids:
        users = User.objects.filter(id__in=user_ids)
        for user in users:
            group_chat.users.add(user)
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response({"error": "No user IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def group_chat_remove_member(request, pk):
    """
    Remove a member from a group chat.
    Expects a user_id in the request data.
    """
    user_id = request.data.get('user_id')
    group_chat = get_object_or_404(GroupChat, id=pk)
    
    try:
        user = User.objects.get(id=user_id)
        group_chat.users.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
