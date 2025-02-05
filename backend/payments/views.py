from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from .serializers import CreateOrderSerializer, TransactionSerializer
from rest_framework.response import Response
from .razor_pay import RazorpayClient
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from django.utils import timezone

# Create your views here.
rz_client = RazorpayClient()


class CreateOrderAPIView(APIView):

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        print(serializer,"serializer")
        if serializer.is_valid():
            amount = serializer.validated_data["amount"]
            
            order_data = rz_client.create_order(amount)
            return Response(order_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this endpoint

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            # Verify the payment with the payment gateway
            rz_client.verify_payment(
                order_id=serializer.validated_data["order_id"],
                payment_id=serializer.validated_data["payment_id"],
                signature=serializer.validated_data["signature"],
            )

            transaction = serializer.save()
            print(transaction.amount)

            # Determine subscription end date based on transaction amount
            if transaction.amount == 120:
                subscription_end_date = timezone.now() + timezone.timedelta(days=30)
            elif transaction.amount == 1000:
                subscription_end_date = timezone.now() + timezone.timedelta(days=365)
            else:
                return Response(
                    {"detail": "Invalid transaction amount."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the user is authenticated
            user = request.user
            if user.is_authenticated:
                user.subscription_status = True
                user.save()

                # Create the subscription
                #check if already subscribed
                if Subscription.objects.filter(user=user).exists():
                    subscription=Subscription.objects.get(user=user)
                    subscription.subscription_end_date=subscription_end_date
                    subscription.save()
                else:
                    subscription = Subscription.objects.create(
                        user=user,
                        transaction=transaction,
                        subscription_end_date=subscription_end_date
                    )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"detail": "User is not authenticated."},
                    status=status.HTTP_403_FORBIDDEN
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

