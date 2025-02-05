from django.urls import path
from .views import SearchUsersView, SendFriendRequestView,accept_friend_request, FriendListView, FriendRequestListView,reject_friend_request,unfriend

urlpatterns = [
    path('api/search-users/', SearchUsersView.as_view(), name='search_users'),
    path('api/friend-request/send/<int:to_user_id>/', SendFriendRequestView.as_view(), name='send_friend_request'),
    path('api/friend-request/accept/<int:friend_id>/', accept_friend_request, name='accept_friend_request'),
    path('api/friend-request/reject/<int:friend_id>/', reject_friend_request, name='reject_friend_request'),
    path('api/friend-list/', FriendListView.as_view(), name='friend_list'),
    path('api/friend-request-list/', FriendRequestListView.as_view(), name='friend_request_list'),
    path('api/unfriend/<int:friend_id>/', unfriend, name='unfriend'),
]
