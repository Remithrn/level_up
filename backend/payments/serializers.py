from rest_framework import serializers
from .models import Transaction,Subscription
from accounts.serializers import CustomUserSerializer

class CreateOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField()
    currency = serializers.CharField(max_length=3)
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['payment_id', 'order_id', 'signature', 'amount']
class SubscriptionSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer()
    user = CustomUserSerializer()
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'subscription_start_date', 'subscription_end_date', 'user','transaction']



