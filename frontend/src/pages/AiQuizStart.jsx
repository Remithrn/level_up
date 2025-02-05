import React, { useState } from 'react';
import Card from '../Components/Card';
import { Card as NextCard, CardHeader, CardBody, Divider, Button, CardFooter } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { updateQuizScore, submiScoreToBackend } from '../features/AiMockinterview/interviewSlice';

const AiQuizStart = () => {
  const {id}= useParams()
  const { aiQuizes, quizScore,quizId } = useSelector((state) => state.interview);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  // Function to confirm the answer
  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before confirming.");
      return;
    }

    const correctAnswer = aiQuizes.quiz[currentQuestionIndex].correct_answer;
    if (selectedAnswer === correctAnswer) {
      toast.success("Correct! The answer is: " + correctAnswer);
      dispatch(updateQuizScore(1));
    } else {
      toast.error("Incorrect! The correct answer is: " + correctAnswer);
    }

    // Move to the next question
    if (currentQuestionIndex < aiQuizes.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset the selected answer for the next question
    } else {
      dispatch(submiScoreToBackend({ score: quizScore, id: quizId}));
      // All questions answered, navigate to the final score page
      navigate(`/ai/quiz/score/${quizId}`); // Ensure this route is defined in your router
    }
  };

  const currentQuestion = aiQuizes.quiz[currentQuestionIndex];

  return (
    <Card>
      
        {/* {quizId} */}
      {currentQuestion && (
        <div className="mt-5">
          <h3 className="text-xl font-bold mb-4">Question {currentQuestionIndex + 1}: {currentQuestion.question}</h3>
          <NextCard className="mb-4">
            <CardHeader>
              <h4 className="font-semibold">Choose an option:</h4>
              <h2>Score: {quizScore}</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="grid grid-cols-2 gap-4 pl-4">
                <Button onClick={() => handleAnswerSelect("A")} variant={selectedAnswer === "A" ? "solid" : "ghost"}>
                  A: {currentQuestion.options.A}
                </Button>
                <Button onClick={() => handleAnswerSelect("B")} variant={selectedAnswer === "B" ? "solid" : "ghost"}>
                  B: {currentQuestion.options.B}
                </Button>
                <Button onClick={() => handleAnswerSelect("C")} variant={selectedAnswer === "C" ? "solid" : "ghost"}>
                  C: {currentQuestion.options.C}
                </Button>
                <Button onClick={() => handleAnswerSelect("D")} variant={selectedAnswer === "D" ? "solid" : "ghost"}>
                  D: {currentQuestion.options.D}
                </Button>
              </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-end">
              <Button color="primary" variant="ghost" size="lg" onClick={handleConfirmAnswer}>
                Confirm Answer
              </Button>
            </CardFooter>
          </NextCard>
        </div>
      )}
    </Card>
  );
};

export default AiQuizStart;
