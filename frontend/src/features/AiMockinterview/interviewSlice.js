// features/interviewSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

//generate ai quiz
export const generateAIQuiz = createAsyncThunk('ai/generateAIQuiz', async ({ topic }, { rejectWithValue, getState }) => {
  try {
    // Construct headers, assuming the token is stored in `state.auth.token`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getState().auth.access}`,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/`,
      { topic },
      { headers }
    );
    return response.data;
  } catch (err) {
    console.error(err, "error")
    // Handle errors by returning a value that can be processed in extraReducers
    return rejectWithValue('An error occurred while generating questions.');
  }
});
// Get quiz with id
export const getQuizWithId = createAsyncThunk('ai/getQuizWithId', async ({ id }, { rejectWithValue, getState }) => {
  try {
    // Construct headers, assuming the token is stored in `state.auth.token`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getState().auth.access}`, // Fixed here
    };

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/get-quiz/${id}`,
      { headers }
    );

    return response.data; // Ensure to return the response data
  } catch (err) {
    console.error(err, "error")
    // Handle errors by returning a value that can be processed in extraReducers
    return rejectWithValue('An error occurred while fetching quiz.');
  }
});
//delete quiz with id
export const deleteQuizWithId = createAsyncThunk('ai/deleteQuizWithId', async ({ id }, { rejectWithValue, getState }) => {
  try {
    // Construct headers, assuming the token is stored in `state.auth.token`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getState().auth.access}`,
    };
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/get-quiz/${id}/`,
      { headers }
    )
    return response.data; // Ensure to return the response data
  }
  catch (err) {
    // Handle errors by returning a value that can be processed in extraReducers
    return rejectWithValue('An error occurred while deleting quiz.');
  }
});


//get all ai quizzes
export const getAllAIQuizzes = createAsyncThunk('ai/getAllAIQuizzes', async (_, { rejectWithValue, getState }) => {
  try {
    // Construct headers, assuming the token is stored in `state.auth.token`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getState().auth.access}`,
    };
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/get-all-quizzes/`,
      { headers }
    );
    return response.data;
  } catch (err) {
    // Handle errors by returning a value that can be processed in extraReducers
    return rejectWithValue('An error occurred while fetching quizzes.');
  }
});
//send score to backend
export const submiScoreToBackend = createAsyncThunk('ai/submitScore', async ({ score, id }, { rejectWithValue, getState }) => {
  try {
    // Construct headers, assuming the token is stored in `state.auth.token`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getState().auth.access}`,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/set-score/`,
      { score, id },
      { headers }
    );
    return response.data;
  } catch (err) {
    // Handle errors by returning a value that can be processed in extraReducers
    return rejectWithValue('An error occurred while submitting score.');
  }
});

// Async thunk for generating interview questions
export const generateInterviewQuestions = createAsyncThunk(
  'interview/generateInterviewQuestions',
  async ({ jobPosition, jobDesc, jobExperience }, { rejectWithValue, getState }) => {
    try {
      // Construct headers, assuming the token is stored in `state.auth.token`
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.access}`,
      };

      // Make the POST request to your backend API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/generate-interview-questions/`,
        { jobPosition, jobDesc, jobExperience },
        { headers }
      );

      // Return the response data
      return response.data;
    } catch (err) {
      // Handle errors by returning a value that can be processed in extraReducers
      return rejectWithValue('An error occurred while generating questions.');
    }
  }
);

//get mock interview questions
export const getMockInterviewQuestions = createAsyncThunk(
  'interview/getMockInterviewQuestions',
  async (mockId, { rejectWithValue, getState }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.access}`,
      }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ai/get-interview-questions/${mockId}`, { headers });
      return response.data;
    }
    catch (err) {
      return rejectWithValue('An error occurred while generating questions.');
    }
  })

//submit interview answers
export const submitInterviewAnswers = createAsyncThunk(
  'interview/submitInterviewAnswers',
  async ({ mockId, answers }, { rejectWithValue, getState }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.access}`,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/submit-interview-answers/${mockId}/`,
        { answers },
        { headers }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue('An error occurred while submitting answers.');
    }
  }
);

//get feedback
export const getFeedback = createAsyncThunk(
  'interview/getFeedback',
  async ({ mockId }, { rejectWithValue, getState }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.access}`,
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ai/get-feedback/${mockId}/`,
        { headers }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue('An error occurred while fetching feedback.');
    }
  }
);
export const getAllInterviews = createAsyncThunk(
  'interview/getAllInterviews',
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.access}`,
      };
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ai/get-all-interviews/`, { headers });
      return response.data;
    } catch (err) {
      return rejectWithValue('An error occurred while fetching feedback.');
    }
  }
);



//delete interview
export const deleteInterview = createAsyncThunk(
  'interview/deleteInterview',
  async ({ mockId }, { rejectWithValue, getState }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().auth.access}`,
      };
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/ai/get-all-interviews/${mockId}/`, { headers });
      return response.data;
    } catch (err) {
      return rejectWithValue('An error occurred while deleting interview.');
    }
  }
);
//get all subscription
export const getSubsDetails = createAsyncThunk(
  'customAdmin/SubsDetails',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/subscription-details/`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Return a rejection value in case of error
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    interviews: [],
    questionz: [],
    loading: false,
    error: null,
    mockId: '',
    feedback: '',
    aiQuizes: [],
    quizScore: 0,
    quizId: '',
    feedbackId: '',
    aiQuizesList: [],
    subsDetails: null,
  },
  reducers: {
    //reducer to update quiz score
    updateQuizScore: (state, action) => {
      // type cast into number to avoid type error
      state.quizScore = state.quizScore + action.payload;
    }
    // Reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInterviewQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInterviewQuestions.fulfilled, (state, action) => {
        state.loading = false;
        const Mockres = action.payload;
        console.log(action.payload, 'Mockres');
        state.mockId = action.payload?.mock_id;
        // state.questionz = (Mockres).replace('```json', '').replace('```', '');

      })
      .addCase(generateInterviewQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMockInterviewQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.feedbackId = '';
      })
      .addCase(getMockInterviewQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questionz = action.payload;
      })
      .addCase(getMockInterviewQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.questionz = [];
        state.feedbackId = '';
      })
      .addCase(submitInterviewAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.feedbackId = '';
      })
      .addCase(submitInterviewAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackId = action.payload;

        console.log(state.feedbackId, 'feedbackId');
      })
      .addCase(submitInterviewAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log(state.error, 'error');
        state.feedbackId = '';
      })
      .addCase(getFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedback.fulfilled, (state, action) => {
        state.loading = false;

        // Function to strip content before ```json
       /*  function stripBeforeJSON(str) {
          const jsonIndex = str.indexOf("```json");
          return jsonIndex !== -1 ? str.substring(jsonIndex + 7).trim() : str.trim();
        }

        // Initial feedback
        state.feedback = action.payload;
        state.feedback = stripBeforeJSON(state.feedback); */
        state.feedback = action.payload;
        console.log(state.feedback, 'feedback 1');

        // Remove ```json from the start of the feedback
      
      })
      .addCase(getFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })
      .addCase(getAllInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = state.interviews.filter(interview => interview.mockId !== action.payload.mock_id);
        console.log(state.interviews, ' after deleting interviews')
        console.log(action.payload, ' after deleting interviews')
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateAIQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.aiQuizes = []
        state.quizScore = 0
      })
      .addCase(generateAIQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.aiQuizes = action.payload?.result;
        state.quizId = action.payload?.id;
        state.quizScore = 0
        console.log(action.payload, 'aiQuizes')
      })
      .addCase(generateAIQuiz.rejected, (state, action) => {
        state.loading = false;
        state.aiQuizes = []
        state.quizScore = 0
        state.quizId = ''
        state.error = action.payload;
        toast.error("An error occurred while generating questions. Please try again.");
        console.log(action.payload, 'aiQuizes')
      })
      .addCase(getAllAIQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAIQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.aiQuizesList = action.payload;
        console.log(action.payload, 'aiQuizes')
      })
      .addCase(getAllAIQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.aiQuizesList = []
        state.error = action.payload;
        toast.error("An error occurred while fetching quizzes. Please try again.");
        console.log(action.payload, 'aiQuizes')
      })
      .addCase(getQuizWithId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.aiQuizes = []
        state.quizScore = 0
      })
      .addCase(getQuizWithId.fulfilled, (state, action) => {
        state.loading = false;
        state.aiQuizes = action.payload;
        console.log(action.payload, 'aiQuizes')
        toast.success("Quiz fetched successfully.");
      })
      .addCase(getQuizWithId.rejected, (state, action) => {
        state.loading = false;
        state.aiQuizes = []
        state.error = action.payload;
        toast.error("An error occurred while fetching quizzes. Please try again.");
        console.error(action.payload, 'aiQuizes')
      })
      .addCase(deleteQuizWithId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuizWithId.fulfilled, (state, action) => {
        state.loading = false;

        state.aiQuizesList = state.aiQuizesList.filter(quiz => quiz.id !== action.payload.id);

        console.log(state.aiQuizesList, ' after deleting interviews')
        console.log(action.payload, ' after deleting interviews')
      })
      .addCase(deleteQuizWithId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.subsDetails = action.payload;
        console.log(action.payload, 'subsDetails')
      })
      .addCase(getSubsDetails.rejected, (state, action) => {
        state.loading = false;
        state.subsDetails = []
        state.error = action.payload;
        toast.error("An error occurred while fetching quizzes. Please try again.");
        console.log(action.payload, 'subsDetails')
      })




  },
});

export const { updateQuizScore } = interviewSlice.actions;
export default interviewSlice.reducer;
