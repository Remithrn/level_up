import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import { Input, Card as NextCard, CardHeader, CardBody, Divider, Button, CardFooter, Spinner } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { generateAIQuiz, getAllAIQuizzes, deleteQuizWithId } from '../features/AiMockinterview/interviewSlice';
import {  Link } from 'react-router-dom';


const AiQuizCreation = () => {
  const [quizTopic, setQuizTopic] = useState('');
  const dispatch = useDispatch();

  const { aiQuizesList, loading } = useSelector((state) => state.interview); // Assuming 'loading' is in your redux state

  // Fetch all quizzes on component mount
  useEffect(() => {
    dispatch(getAllAIQuizzes());
  }, [dispatch]);

  // Handle quiz creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quizTopic.trim().length < 3) {
      toast('Quiz Topic must be at least 3 characters long');
      return;
    }

    // Dispatch the action and wait for it to complete
    await dispatch(generateAIQuiz({ topic: quizTopic })).unwrap();
    dispatch(getAllAIQuizzes())
  };

  // Handle quiz deletion
  const handleDeleteQuiz = async (id) => {
    await dispatch(deleteQuizWithId({ id }));
    toast.success('Quiz deleted successfully');
    dispatch(getAllAIQuizzes()); // Refresh the list after deletion
  };

  return (
    <Card>
      <h1>AI Quiz Creation</h1>
      <NextCard className="mt-2">
        <CardHeader>
          <h2 className="text-center font-bold text-2xl">Create Your Quiz</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            label="Quiz Topic"
            type="text"
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-end">
          <Button className=" hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-x-1  border-t-1 border-blue-500 bg-white px-5 py-6 font-bold uppercase text-blue-500 transition hover:brightness-110" onClick={handleSubmit} disabled={loading}>
            Create Quiz
          </Button>
        </CardFooter>
      </NextCard>

      {loading && (
        <div className="flex justify-center mt-4">
          <Spinner size="lg" />
        </div>
      )}

      {aiQuizesList && aiQuizesList.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Previous Quizzes</h3>
          <ul className="space-y-2">
            {aiQuizesList.map((quiz, index) => (
              <li key={index} className="border border-blue-400 rounded-xl p-2  flex justify-between items-center">
                <Link to={`/ai/quiz/start/${quiz.id}`} className="text-blue-600 hover:underline">
                  <span className="font-medium">{quiz.topic}</span> - Score: {quiz.score || 'N/A'}
                </Link>
                <Button
                 className=" hidden md:flex items-center gap-2 rounded-2xl border-b-4 border-x-1  border-t-1 border-red-500 bg-white px-5 py-6 font-bold uppercase text-red-500 transition hover:brightness-110"
                  onClick={() => handleDeleteQuiz(quiz.id)} // Fixed: Wrapped in anonymous function
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default AiQuizCreation;
