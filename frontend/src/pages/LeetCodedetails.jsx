import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveLeetcodeSubmission } from '../features/LeetCode/LeetcodeSlice';
import CodeEditor from '../Components/Editor';
import moment from 'moment';
import { getAisuggestion } from '../features/LeetCode/LeetcodeSlice';
import { Button, Card } from '@nextui-org/react';
import Markdown from 'markdown-to-jsx';


const LeetCodedetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [codestate, setCode] = useState('');
  const [languagestate, setLanguage] = useState('');
  const { questionNumber, questionTitle, language, link, code, submissionDate, submissionTime, loading, error, res } = useSelector(
    (state) => state.leetcode
  );

  const handleAiAnalyse = () => {
    dispatch(getAisuggestion({ code: code, lanuage: language, title: questionTitle }));
    console.log(res);
  };

  useEffect(() => {
    dispatch(retrieveLeetcodeSubmission({ id }));
  }, [dispatch, id]);

  return (
    <>
    <Card>
    <div className="min-h-screen p-6 flex flex-col items-center w-full">
      {loading && <p className="text-lg text-center text-gray-500">Loading...</p>}
      {error && <p className="text-lg text-center text-red-500">Error: {error}</p>}

      {questionNumber && (
        <div className=" rounded-lg p-8 w-full ">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{questionTitle}</h2>

          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <span className="font-bold">Question Number:</span> {questionNumber}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <span className="font-bold">Language:</span> {language}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <span className="font-bold">Submission Date:</span> {moment(submissionDate).format('MMMM Do YYYY')}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <span className="font-bold">Submission Time:</span> {submissionTime}
            </p>
          </div>

          <div className="mb-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-lg"
            >
              View Problem
            </a>
          </div>

          <div className="mt-6">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              handleAIAnalysis={handleAiAnalyse}
            />
           

            {/* Typecast `res` to string before passing to Markdown */}
            
            
          </div>
        </div>
      )}
    </div>
    </Card>
    <br/>
    <Card>
    {res && <Markdown className="text-left px-4 py-2">{String(res)}</Markdown>}
    </Card>
    </>
  );
};

export default LeetCodedetails;
