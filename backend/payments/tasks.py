from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .models import Subscription

User = get_user_model()

@shared_task
def check_subscriptions():
    # Get the current date and time
    now = timezone.now()
    
    # Check for subscriptions that have expired
    expired_subscriptions = Subscription.objects.filter(subscription_end_date__lt=now)

    for subscription in expired_subscriptions:
        user = subscription.user
        # Set user's subscription status to False
        user.subscription_status = False
        user.save()  # Save the user object to persist the change
        subscription.delete()  # Optionally delete expired subscriptions

    # Check for subscriptions that will expire in the next 3 days
    expiring_subscriptions = Subscription.objects.filter(
        subscription_end_date__gte=now,
        subscription_end_date__lte=now + timezone.timedelta(days=3)
    )

    # Send emails to users with expiring subscriptions
    for subscription in expiring_subscriptions:
        user = subscription.user
        send_mail(
            subject='Your Subscription is About to Expire',
            message=f'Hello {user.username},\n\nYour subscription will expire on {subscription.subscription_end_date}. Please renew it to continue enjoying our services.',
            from_email='your_email@example.com',  # Replace with your email
            recipient_list=[user.email],
        )
