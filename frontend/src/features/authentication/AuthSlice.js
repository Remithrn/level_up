

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: false,
  user: null,
  message: "",
  loading: false,
  error: null,
  status: '',
};

// Thunks
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/logout/`, config);
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/login/`, body, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
//admin login
export const adminlogin = createAsyncThunk(
  "auth/adminlogin",
  async ({ email, password }, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/custom_admin/login/`, body, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verify = createAsyncThunk(
  "auth/verify",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("access");
    if (token) {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const body = JSON.stringify({ token });
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/token/verify/`, body, config);
        return true;
      } catch (err) {
        dispatch(refresh());
        return rejectWithValue(err.response?.data || "Token verification failed");
      }
    }
    return rejectWithValue("No access token available");;
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('access');
    if (token) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      };
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/user/`, config);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
    return rejectWithValue("no access token");
  }
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refresh');
    if (refreshToken) {
      console.log("refresh is there",refreshToken)
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const body = JSON.stringify({ refresh: refreshToken });
      console.log(body)
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/token/refresh/`,
          body,
          config
        ); 
        console.log(res.data)
        return res.data;
      } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data || 'Token refresh failed');
      }
    }
    console.log("no refresh")
    return rejectWithValue('No refresh token available');
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ new_password1, new_password2, old_password }, { dispatch, rejectWithValue }) => {
    await dispatch(verify());
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access')}`
      }
    };
    const body = JSON.stringify({ new_password1, new_password2, old_password });
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/password/change/`, body, config);
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email,username, first_name, last_name, password1, password2 }, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" }
    };
    const body = JSON.stringify({ email,username, first_name, last_name, password1, password2 });
    console.log(body, body,"Re")
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/registration/`, body, config);
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const emailVerification = createAsyncThunk(
  'auth/emailVerification',
  async (key, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" }
    };
    const body = JSON.stringify({ key });
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/registration/verify-email/`, body, config);
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" }
    };
    const body = JSON.stringify({ email });
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/password/reset/`, body, config);
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  'auth/resetPasswordConfirm',
  async ({ uid, token, new_password1, new_password2 }, { rejectWithValue }) => {
    const config = {
      headers: { "Content-Type": "application/json" }
    };
    const body = JSON.stringify({ uid, token, new_password1, new_password2 });
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/password/reset/confirm/`, body, config);
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (code, { dispatch, getState }) => {
      // Check if access token is already in localStorage
      if (!localStorage.getItem('access')) {
          const config = {
              headers: {
                  "Content-Type": "application/json"
              }
          };
          const body = JSON.stringify({ code });
          console.log(body,"body")

          try {
              const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dj-rest-auth/google/`, body, config);
              return res.data; // This will be the payload for fulfilled action
          } catch (err) {
            console.log(err,"err")
              throw new Error('Login has failed'); // This will trigger the rejected action
          }
      } else {
          dispatch(verify());
          dispatch(getUser());
      }
  }
);


// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access, refresh, user } = action.payload;
      state.access = access;
      state.refresh = refresh;
      state.isAuthenticated = true;
      state.user = user;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    },
    clearCredentials: (state) => {
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, {
          payload: { access: action.payload.access, refresh: action.payload.refresh, user: action.payload.user },
        });
        state.error = action.payload
        console.log(state.error)
        console.log(action.payload,"payload")
        console.log(state.refresh,"refresh")
        state.loading = false;
        state.message = "Login has succeeded";
        toast.success("login success")
      })
      .addCase(login.rejected, (state, action) => {
        authSlice.caseReducers.clearCredentials(state);
        state.loading = false;
        state.error = action.payload || "Login has failed";
        console.log(state.error,"n")
        toast.error("login failed")
      })
      // Logout Cases
      .addCase(logout.fulfilled, (state) => {
        authSlice.caseReducers.clearCredentials(state);
        state.message = "User has logged out";
        state.status = "idle";
        state.loading = false
        state.isAuthenticated=false
        toast.success("logout success")
      })
      // Verify Cases
      .addCase(verify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.loading = false;
      })
      .addCase(verify.rejected, (state,action) => {
        state.isAuthenticated = false;
        state.status = 'failed';
        state.loading = false;
        console.log(action.payload)
      })
      // Get User Cases
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log(state.user,"user")
        state.status = 'succeeded';
        state.loading = false;
        state.isAuthenticated = true
      })
      .addCase(getUser.rejected, (state,action) => {
        state.user = null;
        state.status = 'failed';
        state.loading = false;
        console.log(action.payload)
      })
      //refresh
      .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        console.log(action.payload,"refresh payload")
        localStorage.setItem('access', action.payload.access);
        state.access = action.payload.access
        state.isAuthenticated = true
        
        state.loading = false;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Token refresh failed";
        authSlice.caseReducers.clearCredentials(state);  // Use clearCredentials reducer
        console.log(state.error)
        console.log(action.payload,"payload refresh")
      })
      //changePassword
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = ""
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.message = "Change password success";
        state.status = 'succeeded';
        state.loading = false
        toast.success("change password success")
      })
      .addCase(changePassword.rejected, (state) => {
        state.message = "Change password fail";
        state.status = 'failed';
        state.loading = false
        toast.error("change password fail")
      })
      //signUp
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = "loading...ss"
      })
      .addCase(signup.fulfilled, (state, action) => {
        console.log(action.payload, "e")
        state.message = "Verification link has been sent to your email";
        state.status = 'succeeded';
        state.loading = false
        toast.success("Verification link has been sent to your email")
      })
      .addCase(signup.rejected, (state, action) => {
        console.log(action.payload, "rr")
        state.error = action.payload
        console.log(state.error,"errs")
        state.message = "Signup fail";
        state.status = 'failed';
        state.loading = false
        toast.error("Signup fail")
      })
      //emailVerification
      .addCase(emailVerification.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = "loading..."
      })
      .addCase(emailVerification.fulfilled, (state) => {
        state.message = "Your account has been verified";
        state.status = 'succeeded';
        state.loading = false
        toast.success("Your account has been verified")
      })
      .addCase(emailVerification.rejected, (state) => {
        state.message = "Verification account has failed";
        state.status = 'failed';
        state.loading = false
        toast.error("Verification account has failed")
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.message = "loading..."
      })
      .addCase(resetPassword.fulfilled, (state,action) => {
        console.log(action.payload)
        state.message = "Reset password success";
        state.status = 'succeeded';
        state.loading = false
        toast.success("Reset password link has been sent to your email")
      })
      .addCase(resetPassword.rejected, (state,action) => {
        console.log(action.payload)
        state.message = "Reset password fail";
        state.status = 'failed';
        state.loading = false
        toast.error("Reset password fail")
      })
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true
        state.message = "loading..."
      })
      .addCase(resetPasswordConfirm.fulfilled, (state, action) => {
        state.message = "Your new password has been set";
        state.status = 'succeeded';
        state.loading = false
        console.log(action.payload)
        toast.success("Your new password has been set")
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.message = "Set new password failed";
        state.status = 'failed';
        state.loading = false
        state.error = action.payload || "Reset password confirmation failed";
  
        console.log(action.payload)
        toast.error("Set new password failed")
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        console.log(action.payload, "google payload")
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('refresh',action.payload.refresh)
        state.refresh = action.payload.refresh;
        state.access = action.payload.access;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = "Login has succeeded";
        state.loading=false
        toast.success("Login has succeeded")
    })
    .addCase(googleLogin.rejected, (state,action) => {
      console.log(action.payload, "google payload rejected")
        localStorage.removeItem('access');
        state.access = null;
        state.isAuthenticated = false;
        state.user = null;
        state.message = "Login has failed";
        state.loading = false
       
    })
    .addCase(adminlogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(adminlogin.fulfilled, (state, action) => {
      authSlice.caseReducers.setCredentials(state, {
        payload: { access: action.payload.access, refresh: action.payload.refresh, user: action.payload.user },
      });
      state.error = action.payload
      console.log(state.error)
      console.log(action.payload,"payload")
      console.log(state.refresh,"refresh")
      state.loading = false;
      state.message = "Login has succeeded";
      toast.success("login success")
    })
    .addCase(adminlogin.rejected, (state, action) => {
      authSlice.caseReducers.clearCredentials(state);
      state.loading = false;
      state.error = action.payload || "Login has failed";
      console.log(state.error,"n")
      toast.error("login failed")
    })

  },
});

export const {
  setCredentials,
  clearCredentials,

} = authSlice.actions;

export default authSlice.reducer;
