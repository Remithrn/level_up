from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeetcodeSubmissionViewSet, DailyTasksViewSet, UserStreaksViewSet,UserBadgesViewSet,LeaderBoard,BadgeCreateView

router = DefaultRouter()
router.register(r'leetcode-submissions', LeetcodeSubmissionViewSet)
router.register(r'daily-tasks', DailyTasksViewSet)
router.register(r'user-streaks', UserStreaksViewSet)
router.register(r'user-badges', UserBadgesViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard/', LeaderBoard.as_view(), name='leaderboard'),
    path('add-badges/',BadgeCreateView.as_view(), name='add-badges'),
    
]
