import logging
from django.utils import timezone
from django.db import transaction
from .models import DailyTasks, UserStreaks, UserBadges, Badges

logger = logging.getLogger(__name__)

def streakUpdate(user):
    """
    Update user's streak based on daily task completion.
    
    Args:
        user: User object
    
    Returns:
        bool: True if streak was updated successfully, False otherwise
    """
    try:
        with transaction.atomic():
            today = timezone.now().date()
            
            # Get today's tasks in a single query
            daily_task = DailyTasks.objects.filter(
                user=user,
                date=today
            ).first()
            
            if not daily_task:
                print(f"No daily tasks found for user {user.id} on {today}")
                return False
                
            print(
                f"Tasks status - Leetcode: {daily_task.leetcodeTask}, "
                f"Interview=0: {daily_task.aiInterviewTask}, "
                f"Quiz: {daily_task.aiQuizTask}"
            )
            
            # Check if all tasks are completed
            if not all([
                daily_task.leetcodeTask,
                daily_task.aiInterviewTask,
                daily_task.aiQuizTask
            ]):
                print(f"Not all tasks completed for user {user.id}")
                return False
                
            # Update streak
            user_streak, created = UserStreaks.objects.get_or_create(user=user)
            
            if created:
                # New user, start streak
                user_streak.streak_start_date = today
                user_streak.streak_end_date = today
                user_streak.streak_length = 1
                print(f"New streak started for user {user.id}")
            else:
                days_difference = (today - user_streak.streak_end_date).days
                print(f"Days difference: {days_difference}")
                
                if days_difference > 1:
                    # Streak broken, start new streak
                    user_streak.streak_start_date = today
                    user_streak.streak_end_date = today
                    user_streak.streak_length = 1
                    print(f"New streak started for user {user.id}")
                elif days_difference == 1:
                    # Continue streak
                    user_streak.streak_end_date = today
                    user_streak.streak_length += 1
                    print(f"Streak continued for user {user.id}, new length: {user_streak.streak_length}")
                # If days_difference == 0, streak already updated for today
                elif days_difference == 0 and user_streak.streak_length == 0:
                    user_streak.streak_length += 1
                    # Streak already updated for today
                    
                
            user_streak.save()
            
            # Check and award streak badge
            try:
                streak_badge = Badges.objects.filter(badge_type='streak')
                if len(streak_badge) > 1:
                    for badge in streak_badge:
                        if user_streak.streak_length >= badge.badge_threshold:
                            UserBadges.objects.get_or_create(user=user, badge=badge)
                            print(f"Streak badge awarded to user {user.id}")
                elif len(streak_badge) == 1:
                    streak_badge = streak_badge[0]
                    if user_streak.streak_length >= streak_badge.badge_threshold:
                        UserBadges.objects.get_or_create(user=user, badge=streak_badge)
                        print(f"Streak badge awarded to user {user.id}")
            except Badges.DoesNotExist:
                print("Streak badge not found in database")
            
            return True    
    except Exception as e:
        logger.error(f"Error updating streak for user {user.id}: {str(e)}")
        return False