from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .models import UserStreaks
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail

import logging
from django.db import transaction
from django.db.models import F, Q


logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=300,  # 5 minutes
    acks_late=True,
    name="tasks.reset_streaks_at_midnight",
)
def reset_streaks_at_midnight(self):
    """
    Celery task to reset user streaks that haven't been updated in more than a day.

    Returns:
        dict: Summary of the operation including success count and errors
    """
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    stats = {"processed": 0, "reset": 0, "errors": 0}

    try:
        with transaction.atomic():
            # Find all streaks that need to be reset in a single query
            # This is more efficient than checking dates one by one
            expired_streaks = UserStreaks.objects.filter(
                streak_end_date__lt=yesterday, streak_length__gt=0
            )

            # Get the count before update
            streaks_to_reset = expired_streaks.count()
            logger.info(f"Found {streaks_to_reset} expired streaks to reset")

            # Bulk update all expired streaks
            update_result = expired_streaks.update(
                streak_start_date=today, streak_end_date=today, streak_length=0
            )

            stats["processed"] = streaks_to_reset
            stats["reset"] = update_result

            logger.info(
                f"Successfully reset {update_result} streaks. "
                f"Processed {streaks_to_reset} total records."
            )

            # Log details for monitoring
            for streak in expired_streaks:
                logger.debug(
                    f"Reset streak for user {streak.user.username} "
                    f"(previous length: {streak.streak_length})"
                )

            return stats

    except Exception as e:
        stats["errors"] += 1
        error_msg = f"Error resetting streaks: {str(e)}"
        logger.error(error_msg)

        # Retry the task with exponential backoff
        try:
            self.retry(exc=e)
        except self.MaxRetriesExceededError:
            logger.error("Max retries exceeded for reset_streaks_at_midnight task")

        return stats


@shared_task
def send_streak_reminder_emails():
    """
    This task sends reminder emails to users whose streaks are about to expire.
    """
    print("send_streak_reminder_emails called")
    # Fetch users whose streak_end_date is less than today
    users_to_notify = UserStreaks.objects.filter(
        streak_end_date__lte=timezone.now().date()
    )
    print(users_to_notify)

    # Send reminder emails to users
    for user_streak in users_to_notify:
        user = (
            user_streak.user
        )  # Assuming UserStreaks has a ForeignKey to the User model

        try:
            send_mail(
                "Streak Reminder",
                f"Hi {user.username},\n\nYou have not logged in for a while. Please log in today and complete your tasks  to maintain your streak.",
                "levelUp@example.com",  # Replace with your email
                [user.email],  # Send to the user's email
                fail_silently=False,
            )
            print(f"Sent reminder email to {user.username}")
        except Exception as e:
            print(f"Error sending email to {user.username}: {e}")
