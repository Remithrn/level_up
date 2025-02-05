from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import  FriendRequest, UserProfile
from .serializers import UserSerializer,FriendSerializer,FriendRequestSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from accounts.models import UserProfile
from django.shortcuts import get_object_or_404
from django.db.models import Q
User = get_user_model()

#get Friends List
class FriendListView(generics.ListAPIView):
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the user profile of the authenticated user
        user_profile = UserProfile.objects.get(user=self.request.user)
        # Return the queryset of all friends
        return user_profile.friends.all()
    
class SearchUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get("query", "")
        print(query)
        user_id = self.request.user.id
        ##if query is empty return empty list
        if query == "":
            return User.objects.none()
        ##if query less tha 2 characters return empty list
        if len(query) < 2:
            return User.objects.none()
        ##search not only username but also first name and last name and email
        query = query.lower()

        # Create a Q object for the search filter
        search_filter = (
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query)  # Include email normalization if needed
        )

        # Fetch and filter users
        users = User.objects.filter(search_filter).exclude(id=user_id).distinct()

        return users


class SendFriendRequestView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        to_user_id = self.kwargs["to_user_id"]
        to_user = User.objects.get(id=to_user_id)
        from_user = request.user

        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            return Response(
                {"detail": "Request already sent."}, status=status.HTTP_400_BAD_REQUEST
            )

        if FriendRequest.objects.filter(from_user=to_user, to_user=from_user).exists():
            return Response(
                {"detail": "You have a pending request from this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        FriendRequest.objects.create(from_user=from_user, to_user=to_user)
        return Response(
            {"detail": "Request sent successfully."}, status=status.HTTP_201_CREATED
        )


@api_view(["POST"])
def accept_friend_request(request, friend_id):
    print("accept_friend_request function called")
    try:
        # Check if the FriendRequest exists
        friend_request = FriendRequest.objects.get(
            from_user=friend_id, to_user=request.user, accepted=False
        )
    except FriendRequest.DoesNotExist:
        return Response(
            {"error": "Friend request does not exist or is already accepted."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Accept the friend request
    friend_request.accepted = True
    friend_request.save()
    friend_request.delete()

    # Update UserProfile's friends list
    user_profile = UserProfile.objects.get(user=request.user)
    friend_profile = UserProfile.objects.get(user=friend_id)

    # Add the UserProfile instances to each other's friends list
    user_profile.friends.add(friend_profile)
    friend_profile.friends.add(user_profile)

    user_profile.save()
    friend_profile.save()

    # Serialize the updated user data to reflect the new request_status
    serializer = UserSerializer(request.user, context={"request": request})
    return Response(
        {
            "message": "Friend request accepted and friends list updated.",
            "user": serializer.data,
        },
        status=status.HTTP_200_OK,
    )
#reject friend request
@api_view(["POST"])
def reject_friend_request(request, friend_id):
    print("reject_friend_request function called")
    try:
        print("trying to get friend request")
        # Check if the FriendRequest exists
        friend_request = FriendRequest.objects.get(
            from_user=friend_id, to_user=request.user, accepted=False
        )
    except FriendRequest.DoesNotExist:
        print("Friend request does not exist or is already accepted.")
        return Response(
            {"error": "Friend request does not exist or is already accepted."},
            status=status.HTTP_404_NOT_FOUND,
        )
    # Reject the friend request
    friend_request.delete()
    return Response(
        {"message": "Friend request rejected."}, status=status.HTTP_200_OK
    )
@api_view(["POST"])
def unfriend(request, friend_id):
    print("unfriend function called")
    try:
        # Get the current user and the friend to be removed
        user = request.user
        friend = get_object_or_404(User, id=friend_id)

        # Get their respective profiles
        user_profile = get_object_or_404(UserProfile, user=user)
        friend_profile = get_object_or_404(UserProfile, user=friend)

        # Check if the friend exists in the user's friend list
        if friend_profile in user_profile.friends.all():
            # Remove the friend from both profiles' friend lists
            user_profile.friends.remove(friend_profile)
            friend_profile.friends.remove(user_profile)

            # Save the changes
            user_profile.save()
            friend_profile.save()

            return Response(
                {"message": "Friend removed successfully."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Friend not found in your friends list."},
                status=status.HTTP_404_NOT_FOUND,
            )
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
#List all friend requests
class FriendRequestListView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user, accepted=False)