import razorpay
from django.conf import settings
from rest_framework.serializers import ValidationError
from rest_framework import status
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class RazorpayClient:

    def create_order(self, amount):
        data = {
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1",
        }
        try:
            order_data = client.order.create(data=data)
            return order_data
        except Exception as e:
            print(e)

            raise ValidationError(
                {"error": f"Something went wrong : {e}"},
                status.HTTP_400_BAD_REQUEST
            )
    def verify_payment(self, order_id, payment_id, signature):
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        try:
            return client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            print(e)
            raise ValidationError(
                {"error": f"Something went wrong : {e}"},
                status.HTTP_400_BAD_REQUEST
            )