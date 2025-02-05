import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Input } from "@nextui-org/react";
import useSpeechToText from "react-hook-speech-to-text";
import WebCamComponent from "./WebCamComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verify } from "../features/authentication/AuthSlice";
import axios from "axios";

export const QuestionComponent = ({ mockData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedbackid, setFeedbackId] = useState("");

  const { loading, feedbackId } = useSelector((state) => state.interview);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // New state to toggle between typing and speaking
  const [currentAnswer, setCurrentAnswer] = useState("");
  const questions = useMemo(() => JSON.parse(mockData.questions), [mockData.questions]);
  
  const {
    interimResult,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(""));
  const { access } = useSelector((state) => state.auth);

  useEffect(() => {
    if (typeof feedbackId === 'number' && isSubmited) {
      navigate(`/ai/feedback/${feedbackId}`);
    }
  }, [feedbackId, isSubmited, navigate]);

  const submitInterviewAnswers = async (mockId, answers, access) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/submit-interview-answers/${mockId}/`,
        { answers },
        { headers }
      );

      setFeedbackId(response.data.feedbackid);
      navigate(`/ai/feedback/${response.data}`);
    } catch (error) {
      console.error('An error occurred while submitting answers:', error);
      throw new Error('An error occurred while submitting answers.');
    }
  };

  useEffect(() => {
    if (isRecording && interimResult) {
      setCurrentAnswer(interimResult);
    }
  }, [interimResult, isRecording]);

  const handleEnableWebcam = useCallback(() => {
    setWebcamEnabled(true);
  }, []);

  const handleDisableWebcam = useCallback(() => {
    setWebcamEnabled(false);
  }, []);

  const handleQuestionChange = useCallback(
    (index) => {
      if (isRecording) {
        stopSpeechToText();
        setAnswers((prevAnswers) => {
          const newAnswers = [...prevAnswers];
          newAnswers[activeQuestion] = currentAnswer || prevAnswers[activeQuestion];
          return newAnswers;
        });
      }
      setActiveQuestion(index);
      setCurrentAnswer(answers[index] || "");
    },
    [isRecording, stopSpeechToText, activeQuestion, currentAnswer, answers]
  );

  const handleRecordingToggle = useCallback(async () => {
    if (isRecording) {
      stopSpeechToText();
      setAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        newAnswers[activeQuestion] = currentAnswer || prevAnswers[activeQuestion];
        return newAnswers;
      });
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setCurrentAnswer("");
        startSpeechToText();
      } catch (error) {
        console.error("Microphone access denied or error occurred:", error);
        alert("Please enable microphone access in your browser settings.");
      }
    }
  }, [isRecording, stopSpeechToText, startSpeechToText, activeQuestion, currentAnswer]);

  const handleSubmit = useCallback(() => {
    setIsSubmited(true);
    dispatch(verify());
    submitInterviewAnswers(mockData.mockId, answers, access);
  }, [dispatch, mockData.mockId, answers, access]);

  const isSubmitDisabled = answers.some((answer) => answer === "");

  const handleToggleTyping = () => {
    setIsTyping((prevIsTyping) => !prevIsTyping);
  };

  const webcamSize = "380px";

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{mockData.JobPosition}</h2>
          <p className="text-gray-600">{mockData.JobDescription}</p>
        </div>

        <div className="flex space-x-4 mb-6 justify-center">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionChange(index)}
              className={`px-4 py-2 border ${
                activeQuestion === index ? "border-blue-500 bg-blue-100" : ""
              } rounded`}
            >
              Question {index + 1}
            </button>
          ))}
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold">
            Question {activeQuestion + 1}
          </h3>
          <p>{questions[activeQuestion]}</p>
          <h4 className="mt-4 font-semibold">Your Answer:</h4>
          
          {isTyping ? (
            <Input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              fullWidth
              placeholder="Type your answer here"
            />
          ) : (
            <p>
              {isRecording
                ? currentAnswer
                : answers[activeQuestion] || "No answer recorded yet."}
            </p>
          )}
        </div>
      </div>

      <WebCamComponent
        webcamEnabled={webcamEnabled}
        setWebcamEnabled={setWebcamEnabled}
        webcamSize={webcamSize}
        handleDisableWebcam={handleDisableWebcam}
        handleEnableWebcam={handleEnableWebcam}
      />

      <div className="mt-4 flex gap-2 justify-center items-center mx-auto">
        <Button className="btn-custom-blue " onClick={handleRecordingToggle}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Button className="btn-custom-yellow    " onClick={handleToggleTyping}>
          {isTyping ? "Switch to Speaking" : "Switch to Typing"}
        </Button>
        {isRecording && <p>Current input: {currentAnswer}</p>}
      </div>

      <div className="mt-4">
        <Button className="btn-custom-green mx-auto" onClick={handleSubmit} disabled={isSubmitDisabled}>
          Submit Answers
        </Button>
      </div>
    </>
  );
};
