import { badge, user } from "@nextui-org/theme";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    submissions: [],
    questionTitle: "",
    questionNumber: "",
    submissionDate: "",
    submissionTime: "",
    code: "",
    language: "",
    link: "",
    loading: false,
    errorMessage: "", // Added for error handling
    streaks: [],
    dailyTasks:[],
    res:'',
    badges:[],
    otherBadges:[],
};
//get badges 
export const getUserBadges = createAsyncThunk("user/badges", async (_, { rejectWithValue, getState }) => {
    const { access } = getState().auth;
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/user-badges/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});
//get badges with user_id
export const getUserBadgesWithUserId = createAsyncThunk(
    "user_id/badges",
    async (id, { rejectWithValue, getState }) => {
      const { access } = getState().auth;
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/user-badges/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
          // Pass the user_id as a query parameter
          params: {
            user_id: id,
          },
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
  

//get ai suggestion on code 
export const getAisuggestion = createAsyncThunk(
    "leetcode/ai/suggestion",
    async({code,lanuage,title},{rejectWithValue,getState})=>{
        const {access} = getState().auth;
        try{
            const response  = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/analyse-leetcode-solutions/`,{
                code,lanuage,title
            },{
                headers:{
                    Authorization: `Bearer ${access}`
                }
            })
            return response.data;
        }catch(err){
            return rejectWithValue(err.response.data)
        }
    }
)

//get streaks from user id
export const usersStreak = createAsyncThunk(
    'streak/user/get',
    async ({ id }, { rejectWithValue, getState }) => {
      const { access } = getState().auth;
      if (!access) {
        return rejectWithValue("No Access token");
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/user-streaks/user/${id}`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        console.log(response.data, "Response data"); // This should log the correct data
        return response.data;  // Make sure to return response.data
      } catch (err) {
        console.error(err); // Log any potential errors
        return rejectWithValue(err.response ? err.response.data : "An error occurred");
      }
    }
  );

//get streaks
export const getStreaks = createAsyncThunk(
    "streaks/get",
    async (_, { rejectWithValue, getState }) => {
      const { access } = getState().auth;
  
      // Ensure the access token exists before making the request
      if (!access) {
        return rejectWithValue("Access token is missing.");
      }
  
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/user-streaks`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        return response.data;
      } catch (err) {
        // Return a meaningful error message
        if (err.response && err.response.data) {
          return rejectWithValue(err.response.data);
        } else {
          return rejectWithValue("An unexpected error occurred. Please try again.");
        }
      }
    }
  );
            
//get Daily Tasks
export const getDailyTasks = createAsyncThunk("daily/tasks", async (_, { rejectWithValue, getState }) => {
    const { access } = getState().auth;
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/daily-tasks/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Thunk for deleting a LeetCode submission
export const deleteLeetcodeSubmission = createAsyncThunk(
    "leetcode/submission/delete",
    async (id, { rejectWithValue, getState }) => {
        const { access } = getState().auth; // Get access token from state
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/leetcode-submissions/${id}/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            return id; // Return the id of the deleted submission
        } catch (err) {
            return rejectWithValue(err.response.data); // Handle error
        }
    }
);

// Thunk for submitting a new LeetCode submission
export const leetcodeSubmission = createAsyncThunk("leetcode/submission", async (data, { rejectWithValue, getState }) => {
    const { access } = getState().auth;
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/leetcode-submissions/`, data, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data; // Return the new submission data
    } catch (err) {
        return rejectWithValue(err.response.data); // Handle error
    }
});

// Thunk for getting all LeetCode submissions
export const getLeetcodeSubmissions = createAsyncThunk("leetcode/submissions", async (_, { rejectWithValue, getState }) => {
    const { access } = getState().auth;
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/leetcode-submissions/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data; // Return the submissions
    } catch (err) {
        return rejectWithValue(err.response.data); // Handle error
    }
});

// Thunk for retrieving a specific LeetCode submission
export const retrieveLeetcodeSubmission = createAsyncThunk("leetcode/submission/retrieve", async (data, { rejectWithValue, getState }) => {
    const { access } = getState().auth;
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/leetcode-submissions/${data.id}/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data; // Return the submission data
    } catch (err) {
        return rejectWithValue(err.response.data); // Handle error
    }
});

// Create the slice
const leetcodeSlice = createSlice({
    name: "leetcode",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(leetcodeSubmission.pending, (state) => {
                state.loading = true;
            })
            .addCase(leetcodeSubmission.fulfilled, (state, action) => {
                state.loading = false;
                // state.submissions.push(action.payload); // Add new submission to the list
            })
            .addCase(getLeetcodeSubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLeetcodeSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload; // Update submissions list
            })
            .addCase(getLeetcodeSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload; // Set error message
                toast("error")
            })
            .addCase(retrieveLeetcodeSubmission.pending, (state) => {
                state.loading = true;
                // Reset submission details
                state.questionNumber = "";
                state.questionTitle = "";
                state.language = "";
                state.link = "";
                state.code = "";
                state.submissionDate = "";
                state.submissionTime = "";
                state.res="";
            })
            .addCase(retrieveLeetcodeSubmission.fulfilled, (state, action) => {
                state.loading = false;
                // Set submission details from the retrieved data
                state.questionNumber = action.payload.question_number;
                state.questionTitle = action.payload.question_title;
                state.language = action.payload.language;
                state.link = action.payload.question_link;
                state.code = action.payload.code;
                state.submissionDate = action.payload.submission_date;
                state.submissionTime = action.payload.submission_time;
            })
            .addCase(retrieveLeetcodeSubmission.rejected, (state, action) => {
                state.loading = false;
                // Reset submission details and set error message
                state.questionNumber = "";
                state.questionTitle = "";
                state.language = "";
                state.link = "";
                state.code = "";
                state.submissionDate = "";
                state.submissionTime = "";
                state.errorMessage = action.payload; // Set error message
            })
            .addCase(deleteLeetcodeSubmission.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteLeetcodeSubmission.fulfilled, (state, action) => {
                state.loading = false;
                // Filter out the deleted submission
                state.submissions = state.submissions.filter((submission) => submission.id !== action.payload);
            })
            .addCase(deleteLeetcodeSubmission.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload; // Set error message
            })
            .addCase(getDailyTasks.pending, (state) => {
                state.loading = true;
                state.dailyTasks = [];
            })
            .addCase(getDailyTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyTasks = action.payload;
                console.log(state.dailyTasks);
            })
            .addCase(getDailyTasks.rejected, (state, action) => {
                state.loading = false;
                state.dailyTasks = [];
                state.errorMessage = action.payload; // Set error message
            })
            .addCase(getStreaks.pending, (state) => {
                state.loading = true;
                state.streaks = [];
            })
            .addCase(getStreaks.fulfilled, (state, action) => {
                state.loading = false;
                state.streaks = action.payload;
            })
            .addCase(getStreaks.rejected, (state, action) => {
                state.loading = false;
                state.streaks = [];
                state.errorMessage = action.payload; // Set error message
            })
            .addCase(usersStreak.pending, (state) => {
                state.loading = true;
                state.streaks = []; // Optional: clear streaks while loading
            })
            .addCase(usersStreak.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.streaks = action.payload;  // Save the correct streaks data
                    console.log(state.streaks, "streaks");
                } else {
                    console.error("No payload received");  // For debugging if payload is still undefined
                }
            })
            .addCase(usersStreak.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload || "Failed to fetch user streaks";
                console.error(state.errorMessage);
                state.streaks = [];  // Reset streaks on error
            })
            .addCase(getAisuggestion.pending, (state) => {
                state.loading = true;
                state.errorMessage = null;
                state.res = null;
            })
            .addCase(getAisuggestion.fulfilled, (state, action) => {
                state.loading = false;
                state.res = action.payload;
                console.log(action.payload, "res");
            })
            .addCase(getAisuggestion.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload;
                state.res = null;
            })
            .addCase(getUserBadges.pending, (state) => {
                state.loading = true;
                state.errorMessage = null;
                state.badges = [];
            })
            .addCase(getUserBadges.fulfilled, (state, action) => {
                state.loading = false;
                state.badges = action.payload;
                console.log(action.payload, "badges");
            })
            .addCase(getUserBadges.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload;
                state.badges = [];
            })
           .addCase(getUserBadgesWithUserId.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.otherBadges = [];
      })
      .addCase(getUserBadgesWithUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.otherBadges = action.payload;
      })
      .addCase(getUserBadgesWithUserId.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
        state.otherBadges = [];
      });
            
    },
});

export default leetcodeSlice.reducer;
