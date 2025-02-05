import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '../Components/Card';
import { Card as NextCard, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AiQuizScore = () => {
    const [score, setScore] = React.useState(null);

  const { quizScore } = useSelector((state) => state.interview);
  const { id } = useParams();
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/quiz/get-score/`, { id: id })
      .then(response => {
        const backendScore = response.data.score;
        // If backend score is higher, use it; otherwise use quizScore
        if (quizScore !== null && quizScore < backendScore) {
          setScore(backendScore);  // set score from backend
        } else {
          setScore(quizScore);  // use quizScore from Redux
        }
      })
      .catch(error => {
        console.error('Error fetching score:', error);
      });
  }, [quizScore, id]);
  
  // Determine the image and message based on score
  let scoreMessage;
  let scoreImage;

  if (score >= 8) {
    scoreMessage = "Excellent job! You're a genius!";
    scoreImage = "https://images.unsplash.com/photo-1596158662500-79b4a9a5d3aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fHNjb3JlJTIwbWV0ZW50fGVufDB8fHx8MTY4Njc3NzUwMQ&ixlib=rb-4.0.3&q=80&w=400"; // Image for high score
  } else if (score >= 5) {
    scoreMessage = "Good work! You have a solid understanding.";
    scoreImage = "https://images.unsplash.com/photo-1599788559742-257a3ab2b6e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHNjb3JlJTIwZ29vZCUyMG1pbmR8ZW58MHx8fHwxNjg2Nzc4NTA1&ixlib=rb-4.0.3&q=80&w=400"; // Image for average score
  } else {
    scoreMessage = "Keep trying! Practice makes perfect.";
    scoreImage = "https://images.unsplash.com/photo-1535360441380-b248c0c14e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHNjb3JlJTIwdHJ5JTIwYWdhaW58ZW58MHx8fHwxNjg2Nzc4NTA3&ixlib=rb-4.0.3&q=80&w=400"; // Image for low score
  }

  return (
    < >
   
        <div className="flex flex-col items-center justify-center h-screen">
      <NextCard className="mt-4 w-1/2">
        <CardHeader>
          <h2 className="text-center font-bold text-2xl">Your Score</h2>
          <p className="text-center text-gray-500">Your score for Quiz {id} --{score}</p>
        </CardHeader>
        <Divider />
        <CardBody className="text-center">
          <h1 className="text-4xl font-bold">{score} / 10</h1>
          <p className="mt-2 text-lg">{scoreMessage}</p>
          {/* <img 
            src={scoreImage} 
            alt="Score related"
            className="mt-4 w-48 h-auto" 
          /> */}
        </CardBody>
      </NextCard>
      </div>
    </>
  );
}

export default AiQuizScore;
