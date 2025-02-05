# genai.configure(api_key="AIzaSyAZLISV2DgQnzPib6fjCZ5y8f4UmuTNPD8")

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
import google.generativeai as genai
from .models import MockInterview, Feedback, Quiz
from .serializers import (
    MockInterviewSerializer,
    FeedbackSerializer,
    QuizSerializer,
    QuizListSerializer,
    InterviewDetailSerializer,
)
import json
from django.db import transaction
from django.conf import settings
from django.http import JsonResponse
from streaks.models import UserStreaks, Badges, UserBadges, DailyTasks
from streaks.utils import streakUpdate
from django.utils import timezone
from typing import Optional, Tuple, Any
from rest_framework import generics


class AIConnection:
    """Handles AI model interactions and token management"""

    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_content(
        self, prompt: str, user=None, token_cost: int = 10
    ) -> Tuple[Optional[str], Optional[Exception]]:
        try:
            response = self.model.generate_content(prompt)
            if user and not user.subscription_status:
                user.ai_tokens -= token_cost
                user.save()
            return response.text, None
        except Exception as e:
            return None, e


class UserRewardManager:
    """Handles user rewards, streaks, and badges"""

    @staticmethod
    def process_rewards(user) -> None:
        with transaction.atomic():
            # Update experience points
            streak, created = UserStreaks.objects.get_or_create(user=user)
            streak.experience_points += 10
            streak.save()

            # Check badges
            badges = Badges.objects.filter(badge_type="experience")
            for badge in badges:
                if streak.experience_points >= badge.badge_threshold:
                    UserBadges.objects.get_or_create(user=user, badge=badge)

            # Update daily tasks
            daily_task, created = DailyTasks.objects.get_or_create(
                user=user, date=timezone.now().date()
            )
            if not daily_task.aiInterviewTask:
                daily_task.aiInterviewTask = True
                daily_task.save()

            streakUpdate(user)


class GenerateInterviewQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        required_fields = ["jobPosition", "jobDesc", "jobExperience"]
        if not all(field in request.data for field in required_fields):
            return Response(
                {"error": f"Missing required fields: {', '.join(required_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        prompt = (
            f"Imagine you are the interviewer for a company. Generate a list of 5 interview questions in JSON format "
            f"for a candidate applying for the position of {request.data['jobPosition']}, based on the following information:\n"
            f"Job Description: {request.data['jobDesc']}\n"
            f"Candidate Experience: {request.data['jobExperience']} years.\n"
            "important return the array of questions only not an object"
        )

        ai_client = AIConnection()
        questions, error = ai_client.generate_content(prompt, request.user)

        if error:
            return Response(
                {"error": str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        questions = questions.replace("```json", "").replace("```", "")
        mock_interview = MockInterview(
            questions=questions,
            JobPosition=request.data["jobPosition"],
            JobDescription=request.data["jobDesc"],
            JobExperience=int(request.data["jobExperience"]),
            created_by=request.user,
        )
        mock_id = mock_interview.save()

        return Response({"mock_id": str(mock_id)}, status=status.HTTP_200_OK)


class GetMockInterviewQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, mock_id):
        try:
            mock_interview = MockInterview.objects.get(mockId=mock_id)
            serializer = MockInterviewSerializer(mock_interview)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except MockInterview.DoesNotExist:
            return Response(
                {"error": "Mock interview not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubmitInterviewAnswersView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, mock_id):
        try:
            mock_interview = MockInterview.objects.get(mockId=mock_id)
            if not request.data.get("answers"):
                return Response(
                    {"error": "Answers are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            prompt = self._build_feedback_prompt(
                mock_interview, request.data["answers"]
            )
            ai_client = AIConnection()
            feedback_text, error = ai_client.generate_content(prompt, request.user)

            if error:
                return Response(
                    {"error": f"Error generating AI feedback: {error}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            feedback = Feedback(mock_interview=mock_interview, feedback=feedback_text)
            feedback.save()

            UserRewardManager.process_rewards(request.user)

            return Response(feedback.id, status=status.HTTP_200_OK)

        except MockInterview.DoesNotExist:
            return Response(
                {"error": "Mock interview not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def _build_feedback_prompt(
        self, mock_interview: MockInterview, answers: str
    ) -> str:
        return (
            f"You are a skilled interviewer. Below is a set of questions and answers from a mock interview. "
            f"Please rate each answer from 1 to 10 and provide feedback for improvement where necessary.\n\n"
            f"**Questions**:\n\n{mock_interview.questions}\n\n"
            f"**Answers**:\n\n{answers}\n\n"
            "For each question, please follow this format:\n\n"
            " **Question**: <Question Text>  \n"
            " **Answer**: <Answer Text>  \n"
            " **Rating**: <Rating out of 10>  \n"
            " **Feedback**: <Constructive Feedback>\n\n"
            "Please leave double spaces between each question and response pair."
        )


class GetFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, mock_id):
        try:
            feedback = Feedback.objects.get(id=mock_id)
            return Response(feedback.feedback, status=status.HTTP_200_OK)
        except Feedback.DoesNotExist:
            return Response(
                {"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetAllInterviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            interviews = MockInterview.objects.filter(created_by=request.user)
            serializer = MockInterviewSerializer(interviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, mock_id):
        try:
            interview = MockInterview.objects.get(
                mockId=mock_id, created_by=request.user
            )
            interview.delete()
            return Response({"mock_id": mock_id}, status=status.HTTP_200_OK)
        except MockInterview.DoesNotExist:
            return Response(
                {"error": "Interview not found"}, status=status.HTTP_404_NOT_FOUND
            )


class AIQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            quizzes = Quiz.objects.filter(creator=request.user)
            serializer = QuizSerializer(quizzes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        quiz_id = request.data.get("id")
        if not quiz_id:
            return Response(
                {"error": "Quiz ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quiz = Quiz.objects.get(id=quiz_id)
            return Response({"score": quiz.score}, status=status.HTTP_200_OK)
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetAllQuizzesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            quizzes = Quiz.objects.filter(creator=request.user)
            serializer = QuizListSerializer(quizzes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id, creator=request.user)
            serializer = QuizSerializer(quiz)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id, creator=request.user)
            quiz.delete()
            return Response(
                {"message": "Quiz deleted successfully"}, status=status.HTTP_200_OK
            )
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND
            )


class InterviewListAPIView(generics.ListAPIView):
    """
    API view to list all mock interviews along with their associated feedback.
    """

    queryset = MockInterview.objects.all().order_by("-created_at")
    serializer_class = InterviewDetailSerializer


class InterviewDetailAPIView(generics.RetrieveAPIView):
    """
    API view to retrieve the full details of a single mock interview.
    """

    queryset = MockInterview.objects.all()
    serializer_class = InterviewDetailSerializer
    # Since mockId is a UUID field, we set lookup_field accordingly.
    lookup_field = "mockId"


class InterviewDeleteAPIView(generics.DestroyAPIView):
    """
    API view to delete a single mock interview.
    """

    queryset = MockInterview.objects.all()
    serializer_class = InterviewDetailSerializer
    lookup_field = "mockId"
