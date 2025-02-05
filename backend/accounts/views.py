from django.shortcuts import redirect
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserProfileSerializer, CustomUserSerializer,FriendProfileSerializer
from django.http import Http404


class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/"
    client_class = OAuth2Client
    

# Create your views here.
def email_confirmation(request, key):
    return redirect(f"http://localhost:3000/dj-rest-auth/registration/account-confirm-email/{key}")

def reset_password_confirm(request, uid, token):
    print("*****************************************************************************************")
    print(uid,"uid")
    print(token,"token")
    return redirect(f"http://localhost:3000/reset/password/confirm/{uid}/{token}")



class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)

class FriendProfileDetailView(generics.RetrieveAPIView):
    serializer_class = FriendProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        friend_id = self.kwargs.get('friend_id')
        
        try:
            friend_profile = UserProfile.objects.get(user_id=friend_id)
            return friend_profile
        except UserProfile.DoesNotExist:
            raise Http404("Friend profile not found")

class UpdateUsernameView(generics.UpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()