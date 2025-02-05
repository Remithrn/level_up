from .models import MockInterview, Feedback, Quiz
from rest_framework import serializers


class MockInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockInterview
        fields = "__all__"


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = "__all__"


class QuizListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "topic", "score"]


class InterviewDetailSerializer(serializers.ModelSerializer):
    # Using a custom field name "feedback_list" for the nested feedback.
    # Because no related_name was provided in the Feedback model, the reverse relation is "feedback_set"
    feedback_list = FeedbackSerializer(source="feedback_set", many=True, read_only=True)

    class Meta:
        model = MockInterview
        # Include the fields you want to expose
        fields = [
            "mockId",
            "questions",
            "answers",
            "JobPosition",
            "JobDescription",
            "JobExperience",
            "created_by",
            "created_at",
            "updated_at",
            "feedback_list",
        ]

