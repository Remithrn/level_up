import React, { useEffect, useState } from 'react';


import { useNavigate, useParams } from 'react-router-dom';
import { getMockInterviewQuestions } from '../features/AiMockinterview/interviewSlice';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../Components/Card';
import { QuestionComponent } from '../Components/QuestionComponent';


const InterviewStart = () => {
   
    const { questionz,loading,feedback,feedbackId } = useSelector((state) => state.interview);
    const {access} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    // Get mock_id from the URL
    const { mockId } = useParams();

    useEffect(() => {
        dispatch(getMockInterviewQuestions(mockId));
    }, [dispatch, mockId,access]);
    

if (loading){
    return <div>Loading...</div>
}
    return (
        <Card noPadding={true}>
            <div className="my-4 flex flex-col items-center space-y-8">
                {/* Questions Section */}
               
                <div className="w-full">
                    {questionz.questions && <QuestionComponent mockData={questionz} />}
                </div>

                {/* Webcam Section */}
              {feedback && <div>JSON.parse(feedback)</div>}
            </div>
        </Card>
    );
};

export default InterviewStart;
