from django.shortcuts import render
from .serializers import LeaderboardFriendSerializer
from accounts.models import UserProfile
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import LeetcodeSubmission,DailyTasks,UserStreaks,Badges,UserBadges
from .serializers import LeetcodeSubmissionSerializer,DailyTasksSerializer,UserStreaksSerializer,BadgesSerializer,UserBadgesSerializer
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .utils import streakUpdate
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from ai_app.utils import get_leetcode_question_details
from django.db import transaction
# Create your views here.
from django.contrib.auth import get_user_model
User = get_user_model()
class LeetcodeSubmissionViewSet(viewsets.ModelViewSet):
    queryset = LeetcodeSubmission.objects.all()
    serializer_class = LeetcodeSubmissionSerializer
    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        data['user'] = user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        title = data["question_title"]
        print(title,"title===================================")
        res = get_leetcode_question_details(title)
        if res is None:
            #400 error bad request as the leetcode title is wrong 
            return Response({"error": "Invalid Leetcode title"}, status=status.HTTP_400_BAD_REQUEST)
        #add streak to user if user has not submitted today create or get
        streak, created = UserStreaks.objects.get_or_create(user=user)
        #add experience points to user
        streak.experience_points += 10
        streak.save()
        try:
                print("Checking streak badge threshold...")
                badges =  Badges.objects.filter(badge_type='experience')
                if len(badges) > 1:
                    for badge in badges:
                        if streak.experience_points >= badge.badge_threshold:
                            print("Streak badge threshold met!")
                            userBadge,created = UserBadges.objects.get_or_create(user=request.user, badge=badge)
                            userBadge.save()
                elif len(badges) == 1:
                    badge = badges[0]
                    if streak.experience_points >= badge.badge_threshold:
                        print("Streak badge threshold met!")
                        userBadge,created = UserBadges.objects.get_or_create(user=request.user, badge=badge)
                        userBadge.save()
                

            
        except Exception as e:
                # Handle other exceptions
                print("Error checking streak badge threshold:", str(e))

        #add daily tasks to user
        with transaction.atomic():
            daily_tasks, created = DailyTasks.objects.get_or_create(user=user,date = timezone.now().date())
        if daily_tasks.leetcodeTask == False:
            daily_tasks.leetcodeTask = True
            daily_tasks.save()
        streakUpdate(user)
        
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    #list all submission based on user
    def list(self, request, *args, **kwargs):
        user = request.user
        submissions = LeetcodeSubmission.objects.filter(user=user)
        serializer = self.get_serializer(submissions, many=True)
        return Response(serializer.data)
    #one submission based on primary key and user
    def retrieve(self, request, *args, **kwargs):
        user = request.user
        submission = get_object_or_404(LeetcodeSubmission, user=user, id=kwargs['pk'])
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    #delete submission based on primary key and user
    def destroy(self, request, *args, **kwargs):
        user = request.user
        submission = get_object_or_404(LeetcodeSubmission, user=user, id=kwargs['pk'])
        submission.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 


class UserStreaksViewSet(viewsets.ModelViewSet):
    queryset = UserStreaks.objects.all()
    serializer_class = UserStreaksSerializer

    def list(self, request, *args, **kwargs):
        user = request.user
        streaks, created = UserStreaks.objects.get_or_create(user=user)
        
        # Serialize the single instance without 'many=True'
        serializer = self.get_serializer(streaks)  
        return Response(serializer.data)

    # Get streak based on user
    def retrieve(self, request, *args, **kwargs):
        user = request.user
        streak = get_object_or_404(UserStreaks, user=user)
        serializer = self.get_serializer(streak)
        return Response(serializer.data)
    @action(detail=False, methods=['get'], url_path='user/(?P<id>[^/.]+)')
    def get_streak_by_user_id(self, request, id=None):
        # Get the user streaks for the given user ID
        print(id,"id======================")
        streak, created = UserStreaks.objects.get_or_create(user_id=id)
        # Ensure user_id is valid
        serializer = self.get_serializer(streak)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DailyTasksViewSet(viewsets.ModelViewSet):
    queryset = DailyTasks.objects.all()
    serializer_class = DailyTasksSerializer

    def list(self, request, *args, **kwargs):
        user = request.user
        date = timezone.now().date()
        
        try:
            tasks = DailyTasks.objects.filter(user=user, date=date).first()
            
            print(tasks,"================>")
        except DailyTasks.MultipleObjectsReturned:
            
            # Handle the case where multiple entries exist
            tasks = DailyTasks.objects.filter(user=user, date=date).first()  # or choose how you want to resolve this
        except DailyTasks.DoesNotExist:
            tasks = DailyTasks.objects.create(user=user, date=date)

        serializer = self.get_serializer(tasks)
        return Response(serializer.data)



class UserBadgesViewSet(viewsets.ModelViewSet):
    queryset = UserBadges.objects.all()
    serializer_class = UserBadgesSerializer
    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id[id]', None)
        if user_id:
            try:
                user = User.objects.get(id=user_id)    
                print("There is userid =============================>")           

            except Exception as e:
                return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("There is yes userid =============================>")
            user = request.user
        # Get the user's badges
        print(user,"user======================------------")
        badges = UserBadges.objects.filter(user=user)
        serializer = self.get_serializer(badges, many=True)
        return Response(serializer.data)

class LeaderBoard(APIView):
    def get(self, request):
        user_profile = UserProfile.objects.get(user=self.request.user)
        friends = user_profile.friends.select_related(
            'user', 
        ).prefetch_related(
            'user__userstreaks',
        )
        #also add the current user to the list of friends
        friends = [user_profile] + list(friends)
        serializer = LeaderboardFriendSerializer(friends, many=True)
        data = serializer.data

        sorted_data = sorted(data, key=lambda x: x['experience_points'], reverse=True)
        
        print(sorted_data,"sorted_data======================------------")
        
        return Response(sorted_data)

class BadgeCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        print(request.data)
        serializer = BadgesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        