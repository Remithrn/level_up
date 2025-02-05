import React, { useState, useEffect } from 'react';
import CodeEditor from '../Components/Editor';
import { Input, Button } from '@nextui-org/react';
import Card from '../Components/Card';
import { useDispatch } from 'react-redux';
import { leetcodeSubmission } from '../features/LeetCode/LeetcodeSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LeetcodeSubmission = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const [questionNumber, setQuestionNumber] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionLink, setQuestionLink] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");

  const [errors, setErrors] = useState({}); // Store validation errors

  useEffect(() => {
    console.log(language, "language", code, "code");
  }, [language, code]);

  const validateForm = () => {
    const newErrors = {};

    // Validate question number
    if (!questionNumber) {
      newErrors.questionNumber = "Question number is required";
    } else if (isNaN(questionNumber) || questionNumber <= 0) {
      newErrors.questionNumber = "Please enter a valid question number";
    }

    // Validate question title
    if (!questionTitle.trim()) {
      newErrors.questionTitle = "Question title is required";
    }

    // Validate question link
    const urlPattern = /^(https?:\/\/)?(www\.)?leetcode\.com\/(problems|submissions)\/[a-zA-Z0-9\-]+(\/)?$/;

    // Validate language
    if (!language) {
      newErrors.language = "Language is required";
      toast.error("select a language")
    }

    // Validate code
    if (!code.trim()) {
      newErrors.code = "Code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const data = {
        question_number: questionNumber,
        question_title: questionTitle,
        question_link: questionLink,
        language: language,
        code: code,
      };
      dispatch(leetcodeSubmission(data));
      navigation('/leetcode-submission/list');
    }
  };

  return (
    <Card>
      <div className='flex flex-col gap-4 p-2'>
        <h1 className='text-2xl font-bold'>Leetcode Submission</h1>
        <Input
          label="Leetcode Question Number"
          variant='bordered'
          type='number'
          value={questionNumber}
          onChange={(e) => setQuestionNumber(e.target.value)}
          isInvalid={errors.questionNumber ? true : false}
          errorMessage={errors.questionNumber}
        />
        <Input
          label="Leetcode Question Title"
          variant='bordered'
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          isInvalid={errors.questionTitle ? true : false}
          errorMessage={errors.questionTitle}
        />
        <Input
          label="Leetcode Question Link"
          variant='bordered'
          type='url'
          value={questionLink}
          onChange={(e) => setQuestionLink(e.target.value)}
          isInvalid={errors.questionLink ? true : false}
          errorMessage={errors.questionLink}
        />
        
      </div>

      <CodeEditor
        code={code}
        setCode={setCode}
        language={language}
        setLanguage={setLanguage}
      />
      {errors.code && <p className="text-red-500">{errors.code}</p>}
      
    

      <Button className="btn-custom-blue mx-auto mt-2" onClick={handleSubmit}>Submit</Button>
    </Card>
  );
};

export default LeetcodeSubmission;
