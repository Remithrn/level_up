import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getQuizWithId, updateQuizScore, submiScoreToBackend } from "../features/AiMockinterview/interviewSlice";
import Card from "../Components/Card";
import { Tooltip,Card as NextCard, CardHeader, CardBody, Divider, Button, CardFooter } from "@nextui-org/react";

const AiQuiz = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { aiQuizes, quizScore, quizId, loading } = useSelector((state) => state.interview);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    dispatch(getQuizWithId({ id }));
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentQuestion = aiQuizes?.quiz?.quiz[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>No question available.</div>; // Handle case when currentQuestion is null
  }

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before confirming.");
      return;
    }

    const correctAnswer = currentQuestion.correct_answer;
    if (selectedAnswer === correctAnswer) {
      toast.success("Correct! The answer is: " + correctAnswer);
      dispatch(updateQuizScore(1));
    } else {
      toast.error("Incorrect! The correct answer is: " + correctAnswer);
    }

    if (currentQuestionIndex < aiQuizes.quiz.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      dispatch(submiScoreToBackend({ score: quizScore, id: id }));
      navigate(`/ai/quiz/score/${id}`);
    }
  };

  return (
    <Card>
      <div className="mt-5">
        <h3 className="text-xl font-bold mb-4">Question {currentQuestionIndex + 1}: {currentQuestion.question}</h3>
        <NextCard className="mb-4">
          <CardHeader className="flex justify-between items-center">
            <h4 className="font-semibold">Choose an option:</h4>
            <h2>Score: {quizScore}</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            {/* Responsive grid layout with single column on small screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 p-2">
              {['A', 'B', 'C', 'D'].map(option => (
                <Tooltip content={`${option}: ${currentQuestion.options[option]}`} key={option}>
                <Button
                  key={option}
                  className={`flex items-center gap-2 rounded-2xl border-b-4 border-x-1 border-t-1 px-5 py-6 font-bold break-words transition hover:brightness-110 ${
                    selectedAnswer === option ? 'bg-violet-500 text-white' : 'bg-white text-violet-500 border-violet-500'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}: {currentQuestion.options[option]}
                </Button>
                </Tooltip>
              ))}
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
    </Card>
  );
};

export default AiQuiz;
