import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authentication/AuthSlice';
import profileReducer from '../features/authentication/ProfileSlice';
import friendsReducer from '../features/friends/FriendSlice';
import interviewSlice from '../features/AiMockinterview/interviewSlice';
import leetcodeReducer from '../features/LeetCode/LeetcodeSlice';
import customAdminReducer from '../features/customAdmin/customAdminSlice';
const store = configureStore({
  reducer: {
    auth: authReducer, 
    profile: profileReducer,
    friends: friendsReducer,
    interview: interviewSlice,
    leetcode: leetcodeReducer,
    customAdmin: customAdminReducer,
  },
});

export default store;
