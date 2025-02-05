import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
const initialState = {
  users: [],
  loading: false,
  totalSales: null,
  salesData: [],
  error: null,
  badges: [],
};

//fetch all badges
export const fetchallBadges = createAsyncThunk(
  'admin/fetchallBadges',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/badges/`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch badges');
    }
  }
);

//delete a badge
export const deleteBadge = createAsyncThunk(
  'admin/deleteBadge',
  async (badgeId, { rejectWithValue, getState }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/badges/${badgeId}/`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      return badgeId;  // Return the badgeId to help with state update on successful deletion
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting badge');
    }
  }
);




//add badges
export const addBadges = createAsyncThunk(
  'admin/addBadges',
  async (badgeData, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/streaks/add-badges/`,
        badgeData,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add badge');
    }
  }
);

// Async thunk for fetching users
export const fetchallUsers = createAsyncThunk(
  'customAdmin/fetchallUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/users/`,
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
//deactivate user based on username
export const deactivateUser = createAsyncThunk(
  'deactivate/user',
  async (username, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/users/deactivate/${username}/`,
        {}, // Empty body for the POST request
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
//get total sales
export const getTotalSales = createAsyncThunk(
  'getTotalSales',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/total-sales/`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
// Get sales details
export const getSalesDetails = createAsyncThunk(
  'getSalesDetails',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/custom_admin/sales-details/`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.access}`,
          },
        }
      );
      console.log("here")
      return response.data;
    } catch (error) {
      console.log(error,"here")
      // Add error handling with rejectWithValue
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


const customAdminSlice = createSlice({
  name: 'customAdmin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchallUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchallUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchallUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deactivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTotalSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalSales.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSales = action.payload;
      })
      .addCase(getTotalSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSalesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })
      .addCase(getSalesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBadges.fulfilled, (state, action) => {
        state.loading = false;
       console.log(action.payload,"success")
      })
      .addCase(addBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchallBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchallBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload;
      })
      .addCase(fetchallBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = state.badges.filter(badge => badge.id !== action.payload);
      })
      .addCase(deleteBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customAdminSlice.reducer;