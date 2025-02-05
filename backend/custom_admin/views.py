from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth import get_user_model
from .serializers import UserProfileSerializer
from accounts.models import UserProfile,CustomUserModel
from payments.models import Transaction
from payments.serializers import TransactionSerializer
from django.db.models import Sum
from .serializers import SalesDetailsSerializers
from rest_framework import generics
from dj_rest_auth.views import LoginView
from payments.serializers import SubscriptionSerializer
from payments.models import Subscription
from streaks.models import Badges
from streaks.serializers import BadgesSerializer
from rest_framework.viewsets import ModelViewSet

class UserList(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    def get(self, request):
        #exclude the current user
        users = UserProfile.objects.all().exclude(user=request.user)
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)
    
#deactivate user based on username
class UserDeactivate(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    def post(self, request, username):
        print("username",username)
        try:
            user = CustomUserModel.objects.get(username=username)
            
            user.is_active = not user.is_active
            user.save()
            return Response({"message": "User status toggled successfully."}, status=200)
        except Exception as e:
            print("error",e)
            return Response({"message": "User not found."}, status=404)
        
#total sales
class TotalSales(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    def get(self, request):
        total_sales = Transaction.objects.all().aggregate(total_sales=Sum('amount'))
        return Response(total_sales)  #



class SalesDetailsListView(generics.ListAPIView):
    serializer_class = SalesDetailsSerializers

    def get_queryset(self):
        return Transaction.objects.all()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total_sales = queryset.aggregate(total_sales=Sum('amount'))['total_sales'] or 0  # Default to 0 if None
        serializer = self.get_serializer(queryset, many=True, context={'total_sales': total_sales})
        return Response(serializer.data)

   
#admin login
class AdminLoginView(LoginView):
    permission_classes = []  # No additional permissions needed here

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = response.data.get("user")
        print("user=============",user)
        adminuser = CustomUserModel.objects.get(email=user["email"])
        print("adminusername=============",adminuser)
        print("adminusername=============",adminuser.is_staff)
        
        # Check if user is authenticated and is admin
        if user and adminuser.is_staff:  # Assuming `is_staff` is the field indicating admin status
            return Response({
                "message": "Login successful",
                "user": user,
                "access": response.data.get("access"),
                "refresh": response.data.get("refresh"),
            })
        else:
            return Response({"message": "You do not have admin access."}, status=403)

class SubscriptionListView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer
    def get_queryset(self):

        return Subscription.objects.all().exclude(user=self.request.user)

class BadgesViewset(ModelViewSet):
    queryset = Badges.objects.all()
    serializer_class = BadgesSerializer
    permission_classes = [IsAuthenticated,IsAdminUser]