import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { act } from 'react';
import { fetchFriends } from '../authentication/ProfileSlice';
import { toast } from 'react-toastify';

//friend request list
export const friendRequestList = createAsyncThunk('friendRequestList', async (_, { rejectWithValue, getState }) => {
  try {
    // Get access token from auth slice
    const accessToken = getState().auth.access;
    console.log(accessToken,"accessToken")
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search/api/friend-request-list/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchUsers = createAsyncThunk('friends/fetchUsers', async ({ query, accessToken }) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search/api/search-users/?query=${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
});

export const sendFriendRequest = createAsyncThunk('friends/sendFriendRequest', async ({ toUserId, accessToken }) => {
  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/search/api/friend-request/send/${toUserId}/`, {}, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return toUserId;
});

export const acceptFriendRequest = createAsyncThunk('friends/acceptFriendRequest', async ({ friendId, accessToken },{dispatch}) => {
    console.log("friendId",friendId)
  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/search/api/friend-request/accept/${friendId}/`, {}, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  dispatch(fetchFriends())
  return friendId;

});

export const fetchfriendProfile = createAsyncThunk('friends/fetchfriendProfile', async ({ friendId, accessToken }) => {
  console.log(friendId,"friendId")
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/friend/${friendId}/`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
});
export const rejectFriendRequest = createAsyncThunk('friends/rejectFriendRequest', async ({ friendId }, { rejectWithValue, getState }) => {
  const accessToken = getState().auth.access;
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/search/api/friend-request/reject/${friendId}/`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return friendId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
})

//unfriend
export const unfriend = createAsyncThunk('friends/unfriend', async ({ friendId}, { rejectWithValue, dispatch,getState }) => {
  console.log("in unfriend",friendId)
  const accessToken = getState().auth.access;
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/search/api/unfriend/${friendId}/`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    // Dispatch friendRequestList or fetchFriends to update the state after unfriending
    dispatch(friendRequestList());
    
    return friendId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    searchResults: [],
    friendRequests: [],
    loading: false,
    error: null,
    profile: null,
    request_status:"",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const userId = action.payload;
        const updatedResults = state.searchResults.map(user =>
          user.friend_id === userId ? { ...user, request_status: 'sent' } : user
        );
        //updating profile.request_status
        const updatedProfile = state.profile.friend_id === userId? { ...state.profile, request_status: 'sent' } : state.profile;
        state.profile = updatedProfile;
      
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const friendId = action.payload;
        console.log(action.payload,"action.payload in acceptFriendRequest")
        
        

        state.friendRequests = state.friendRequests.filter(friend => friend.from_user_id
          !== action.payload);
          console.log(state.friendRequests,"state.friendRequests")
        
      })
      .addCase(fetchfriendProfile.fulfilled, (state, action) => {
        console.log(action.payload,"action.payload")
        state.profile = action.payload;
        console.log(state.profile,"profile")
      })
      .addCase(fetchfriendProfile.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchfriendProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(friendRequestList.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(friendRequestList.fulfilled, (state, action) => {
        state.friendRequests = action.payload;
        state.loading = false;
        console.log(action.payload,"action.payload")
        console.log(state.friendRequests,"state.friendRequests")
      })
      .addCase(friendRequestList.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        console.log(state.error,"state.error")
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        console.log(action.payload,"action.payload")
        state.friendRequests = state.friendRequests.filter(friend => friend.from_user_id
          !== action.payload);
        console.log(state.friendRequests,"state.friendRequests")
        state.loading = false;
      })
      .addCase(rejectFriendRequest.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(unfriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfriend.fulfilled, (state, action) => {
        const friendId = action.payload;

        // update profile.request_status
        
        const updatedProfile = state.profile?.friend_id === friendId ? { ...state.profile, request_status: 'none' } : state.profile;
        state.profile = updatedProfile;
        state.friendRequests = state.friendRequests.filter(friend => friend.from_user_id !== friendId);
        state.loading = false;
      })
      .addCase(unfriend.rejected, (state, action) => {
        state.error = action.payload || 'Failed to unfriend.';
        state.loading = false;
        toast.error("Failed to unfriend.");
      });
  }
});

export default friendsSlice.reducer;