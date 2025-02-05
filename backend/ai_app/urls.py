from .views import (
    GenerateInterviewQuestionsView,
    GetMockInterviewQuestionsView,
    SubmitInterviewAnswersView,
    GetFeedbackView,
    GetAllInterviewsView,
    GetScoreView,
    GetAllQuizzesView,
    GetQuizView,
    InterviewListAPIView,
    InterviewDetailAPIView,
    InterviewDeleteAPIView,
)
from django.urls import path
from .ai_views import (
    InterviewFeedbackAPIView,
    QuizAPIView,
    SetScoreView,
    Analyse_leetcode_solutions,
)


urlpatterns = [
    path(
        "generate-interview-questions/",
        GenerateInterviewQuestionsView.as_view(),
        name="generate-interview-questions",
    ),
    path(
        "get-interview-questions/<uuid:mock_id>/",
        GetMockInterviewQuestionsView.as_view(),
        name="get-interview-questions",
    ),
    path(
        "submit-interview-answers/<uuid:mock_id>/",
        SubmitInterviewAnswersView.as_view(),
        name="submit-interview-answers",
    ),
    path("get-feedback/<int:mock_id>/", GetFeedbackView.as_view(), name="get-feedback"),
    path(
        "get-all-interviews/", GetAllInterviewsView.as_view(), name="get-all-interviews"
    ),
    path(
        "get-all-interviews/<uuid:mock_id>/",
        GetAllInterviewsView.as_view(),
        name="delete-interview",
    ),  # Add this route for DELETE
    path(
        "interview-feedback/<uuid:mock_id>/",
        InterviewFeedbackAPIView.as_view(),
        name="interview-feedback",
    ),
    path("quiz/", QuizAPIView.as_view(), name="quiz"),
    path("quiz/set-score/", SetScoreView.as_view(), name="set-score"),
    path("quiz/get-score/", GetScoreView.as_view(), name="get-score"),
    path("quiz/get-all-quizzes/", GetAllQuizzesView.as_view(), name="get-all-quizzes"),
    path("quiz/get-quiz/<uuid:quiz_id>/", GetQuizView.as_view(), name="get-quiz"),
    path(
        "analyse-leetcode-solutions/",
        Analyse_leetcode_solutions.as_view(),
        name="analyse-leetcode-solutions",
    ),
    path("interviews/", InterviewListAPIView.as_view(), name="interview-list"),
    path(
        "interviews/<uuid:mockId>/",
        InterviewDetailAPIView.as_view(),
        name="interview-detail",
    ),
    path(
        "interviews/<uuid:mockId>/delete/",
        InterviewDeleteAPIView.as_view(),
        name="interview-delete",
    ),
]

