import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { verify } from './AuthSlice';

// Thunks for async actions

// Fetch user profile
// export const fetchUserProfile = createAsyncThunk(
//   'profile/fetchUserProfile',
//   async (_, { rejectWithValue, getState }) => {
//      //verify
     
//     try {
//       // Get access token from auth slice
//       const accessToken = getState().auth.access;
//       console.log(accessToken,"accessToken")

//       const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      // Get access token from auth slice
      const accessToken = getState().auth.access;

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      // Check if the error is due to token expiration (401 or 403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Dispatch verify to refresh the token
        const verifyResult = await dispatch(verify());

        if (verifyResult.meta.requestStatus === 'fulfilled') {
          // If token is refreshed successfully, retry fetching the profile
          const newAccessToken = getState().auth.access;
          try {
            const retryResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            return retryResponse.data;
          } catch (retryError) {
            return rejectWithValue(retryError.response.data);
          }
        } else {
          // If token refresh fails, reject with original error
          return rejectWithValue('Token refresh failed. Please login again.');
        }
      } else {
        // If the error is not token-related, reject with the original error
        return rejectWithValue(error.response.data);
      }
    }
  }
);

// get friends
export const fetchFriends = createAsyncThunk(
  'profile/fetchFriends',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get access token from auth slice
      const accessToken = getState().auth.access;
      console.log(accessToken,"accessToken")
    console.log("accessToken",accessToken)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search/api/friend-list/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      // Get access token from auth slice
      const accessToken = getState().auth.access;
      console.log("accessToken",accessToken)

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/profile/`, profileData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
  friends_list:[]
};

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Friends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends_list = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
