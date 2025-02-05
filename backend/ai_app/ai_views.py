import json
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from slugify import slugify

from .models import MockInterview, Feedback, Quiz
from streaks.models import UserStreaks, DailyTasks, UserBadges, Badges
from streaks.utils import streakUpdate
from .utils import get_leetcode_question_details, check_ai_tokens

# Import your AIConnection class
from .views import AIConnection


def sanitize_json_string(raw_string):
    """
    Given a raw string that contains JSON delimited by ```json and ```,
    extract the JSON portion and parse it.
    """
    # Find the start and end of the JSON content
    start_index = raw_string.find("```json") + len("```json")
    end_index = raw_string.rfind("```")

    # Extract the JSON part
    json_string = raw_string[start_index:end_index].strip()

    # Try parsing the JSON to ensure it's valid
    try:
        parsed_data = json.loads(json_string)
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        return None


class InterviewFeedbackAPIView(APIView):
    @check_ai_tokens(10)
    def post(self, request, mock_id, *args, **kwargs):
        # Extract mock interview ID and answers from the request body
        answers = request.data.get("answers", [])

        # Fetch questions from the database using the mockId
        try:
            mock_interview = MockInterview.objects.get(mockId=mock_id)
            questions = json.loads(mock_interview.questions)
        except MockInterview.DoesNotExist:
            return Response(
                {"error": "Mock interview not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Validate that the number of answers matches the number of questions
        if not questions or len(questions) != len(answers):
            return Response(
                {"error": "Invalid number of questions or answers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ai_connection = AIConnection()
        feedback_list = []

        # Iterate over questions and answers
        for question, answer in zip(questions, answers):
            # Build a prompt that includes the system instructions plus the question and answer.
            prompt = (
                f"You are a skilled interviewer conducting a Python Django interview.\n"
                f"Below is a question and an answer from a mock interview.\n"
                f"Question: {question}\n"
                f"Answer: {answer}\n\n"
                f"Please rate the answer from 1 to 10 and provide feedback for improvement in the following JSON format. "
                f"Make the feedback 2 to 3 lines only:\n\n"
                f"{{\n"
                f'    "question": "Question",\n'
                f'    "answer": "Answer",\n'
                f'    "rating": <rating>,\n'
                f'    "feedback": "Feedback for the answer"\n'
                f"}}\n\n"
                f"Ensure that all keys and string values are enclosed in double quotes. Do not include any markdown or extra formatting."
            )

            # Send the prompt to the AI using our connection
            result_text, error = ai_connection.generate_content(prompt)
            if error:
                return Response(
                    {
                        "error": f"Failed to generate feedback for question: {question}. Error: {str(error)}"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Sanitize and parse the returned JSON
            parsed_result = sanitize_json_string(result_text)
            if not parsed_result:
                return Response(
                    {"error": "Failed to parse the AI response."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            feedback_list.append(parsed_result)

        # Combine all feedback into a final result
        final_feedback = {"feedback": feedback_list}
        print(final_feedback)

        # Save the feedback to the database and update user streaks / tasks
        try:
            feedback_instance = Feedback.objects.create(
                mock_interview=mock_interview, feedback=json.dumps(final_feedback)
            )
            feedback_instance.save()

            streak, created = UserStreaks.objects.get_or_create(user=request.user)
            streak.experience_points += 10
            streak.save()

            # Check if badge threshold is reached
            badges = Badges.objects.filter(badge_type="experience")
            for badge in badges:
                if streak.experience_points >= badge.badge_threshold:
                    userBadge, created = UserBadges.objects.get_or_create(
                        user=request.user, badge=badge
                    )
                    userBadge.save()

            with transaction.atomic():
                daily_task, created = DailyTasks.objects.get_or_create(
                    user=request.user, date=timezone.now().date()
                )
            if not daily_task.aiInterviewTask:
                daily_task.aiInterviewTask = True
                daily_task.save()

            streakUpdate(request.user)
        except Exception as e:
            return Response(
                {"error": f"Error saving feedback: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Return the final feedback JSON directly in the response
        return Response(final_feedback, status=status.HTTP_200_OK)


class QuizAPIView(APIView):
    @check_ai_tokens(10)
    def post(self, request, *args, **kwargs):
        # Extract the topic from the request body
        topic = request.data.get("topic")
        if not topic:
            return Response(
                {"error": "Invalid topic input."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ai_connection = AIConnection()

        # Build the prompt for generating a multiple-choice quiz.
        prompt = (
            f"You are a quiz generator AI. Your task is to generate multiple-choice quiz questions "
            f"on the topic: {topic}. Provide each question with four answer options (A, B, C, D) and "
            f"the correct answer.\n\n"
            f"Generate 10 multiple-choice quiz questions in the following JSON format:\n\n"
            f"{{\n"
            f'    "quiz": [\n'
            f"        {{\n"
            f'            "question": "Sample question?",\n'
            f'            "options": {{\n'
            f'                "A": "Option A",\n'
            f'                "B": "Option B",\n'
            f'                "C": "Option C",\n'
            f'                "D": "Option D"\n'
            f"            }},\n"
            f'            "correct_answer": "A"\n'
            f"        }},\n"
            f"        ...\n"
            f"    ]\n"
            f"}}\n\n"
            f"Ensure the response is valid JSON without any markdown or extra formatting."
        )

        # Get the AI-generated quiz content
        result_text, error = ai_connection.generate_content(prompt)
        if error:
            return Response(
                {"error": f"Error generating quiz: {str(error)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        print(result_text)

        # Reduce ai_tokens for non-subscribed users
        user = request.user
        if not user.subscription_status:
            user.ai_tokens -= 10
            user.save()

        # Save the quiz to the database
        try:
            quiz = Quiz.objects.create(
                topic=topic, quiz=result_text, creator=request.user
            )
            quiz.save()
            quiz_id = quiz.id
            return Response(
                {"result": result_text, "id": quiz_id}, status=status.HTTP_200_OK
            )
        except Exception as e:
            print(e, "*****************************")
            return Response(
                {"error": f"Error saving quiz: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SetScoreView(APIView):
    def post(self, request):
        quiz_id = request.data.get("id")
        if not quiz_id:
            print("id is required")
            return Response(
                {"error": "ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            print("quiz not found")
            return Response(
                {"error": "Quiz not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Add experience points to user
        streaks, created = UserStreaks.objects.get_or_create(user=request.user)
        streaks.experience_points += 10
        streaks.save()

        # Check if badge thresholds are met
        badges = Badges.objects.filter(badge_type="experience")
        for badge in badges:
            if streaks.experience_points >= badge.badge_threshold:
                userBadge, created = UserBadges.objects.get_or_create(
                    user=request.user, badge=badge
                )
                userBadge.save()

        # Update the daily tasks
        with transaction.atomic():
            dailyTasks, created = DailyTasks.objects.get_or_create(
                user=request.user, date=timezone.now().date()
            )
        if not dailyTasks.aiQuizTask:
            dailyTasks.aiQuizTask = True
            dailyTasks.save()

        streakUpdate(request.user)
        score = request.data.get("score")
        if score is None:
            return Response(
                {"error": "Score is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the score in the database
        quiz.score = score
        quiz.save()

        return Response(
            {"message": "Score updated successfully."}, status=status.HTTP_200_OK
        )


class Analyse_leetcode_solutions(APIView):
    permission_classes = [AllowAny]

    @check_ai_tokens(10)
    def post(self, request):
        # Extract the title and code from the request body
        title = request.data.get("title")
        code = request.data.get("code")
        title_slug = slugify(title)
        print(title_slug, "*****************************")
        print(code, "*****************************")
        if not title:
            return Response(
                {"error": "Invalid title input."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        leetcode_question = get_leetcode_question_details(title_slug)
        if not leetcode_question:
            return Response(
                {"error": "Invalid title input or question not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ai_connection = AIConnection()

        # Prepare the prompt for code analysis
        prompt = f"""
Analyze the following code solution for the LeetCode question:

Question: {leetcode_question['title']}
Difficulty: {leetcode_question['difficulty']}
Description: {leetcode_question['content']}
Example Test Cases: {leetcode_question['example_testcases']}

User's code:
{code}

Please provide the following in Markdown format:

**Question and Context:**
    * Question: [LeetCode question title]
    * Difficulty: [Easy, Medium, Hard]
    * Description: [Briefly summarize the question's core objective.]
    * Example Test Cases: [Show a couple of key test cases and their expected outputs. This helps in understanding the problem and the code's behavior.]

**Code Analysis:**
    * Correctness: [State whether the code is correct. If not, explain why and provide specific examples of failing test cases. If partially correct, explain which cases it passes and which it fails.]
    * Time Complexity: [Analyze the time complexity using Big O notation (e.g., O(n), O(log n), O(n^2)). Explain the reasoning behind the analysis.]
    * Space Complexity: [Analyze the space complexity using Big O notation. Explain the reasoning behind the analysis, considering auxiliary space used.]

**Improvements and Optimizations:**
    * [Provide specific suggestions for improving the code's efficiency, readability, or maintainability. This could involve algorithmic changes, code restructuring, or use of more appropriate data structures. If the code is already optimal, state "No significant improvements possible."]

**Edge Cases:**
    * [Identify potential edge cases that the code might not handle correctly. These could include empty inputs, null values, extreme values, or unusual input patterns. Provide specific examples of such edge cases and explain how the code could be modified to handle them.]

**Overall Feedback:**
    * [Provide a concise summary of the code's strengths and weaknesses. Offer constructive criticism and highlight areas where the code excels or needs further improvement. Indicate if the solution is considered optimal, acceptable, or needs substantial revision.]
        """
        try:
            response_text, error = ai_connection.generate_content(prompt)
            if error:
                raise Exception(error)
            analysis = response_text
            print(analysis)
            # Reduce ai_tokens for non-subscribed users
            headers = {"Content-Type": "text/markdown"}
            user = request.user
            if not user.subscription_status:
                user.ai_tokens -= 10
                user.save()
        except Exception as e:
            print(e, "*****************************")
            return Response(
                {"error": f"Error generating analysis: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Return the analysis
        return Response(analysis, status=status.HTTP_200_OK, headers=headers)
