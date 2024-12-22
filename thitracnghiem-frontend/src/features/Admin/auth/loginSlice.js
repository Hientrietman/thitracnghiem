// loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          email: credentials.username,
          password: credentials.password,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLogin: localStorage.getItem("token") ? true : false,
    isLoading: false,
    error: null,
    role: localStorage.getItem("role") || "USER",
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    logout(state) {
      state.isLogin = false;
      state.user = null;
      state.role = "USER";
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.user = action.payload.data.user;
        state.role = action.payload.data.role;
        state.token = action.payload.data.token;
        localStorage.setItem("token", action.payload.data.token);
        localStorage.setItem("role", action.payload.data.role);
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
