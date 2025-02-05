import React, { useEffect, useState } from 'react';
import FeedbackComponent from '../Components/FeedbackComponent';
import { useSelector, useDispatch } from 'react-redux';
import { getFeedback } from '../features/AiMockinterview/interviewSlice';
import { useParams } from 'react-router-dom';

const AiinterviewFeedback = () => {
  const { feedback, loading } = useSelector((state) => state.interview);
  const dispatch = useDispatch();
  const { mockId } = useParams();
  
  const [parsedFeedbacks, setParsedFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getFeedback({ mockId }));
  }, [dispatch, mockId]);

  useEffect(() => {
    if (!loading && feedback) {
      console.log("Feedback received:", feedback);
      try {
        // Only parse feedback when it's available and loading is over
        const newfeedback =String(feedback)
        setParsedFeedbacks(newfeedback);
      } catch (err) {
        console.log(err)
        setError("Failed to parse feedback", err);
      }
    }
  }, [loading, feedback]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <FeedbackComponent feedbacks={parsedFeedbacks} />
    </div>
  );
};

export default AiinterviewFeedback;
