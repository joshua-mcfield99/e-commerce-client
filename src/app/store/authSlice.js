// Import the necessary function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the authentication slice
const initialState = {
  isAuthenticated: false, // Indicates whether the user is logged in
  user: null,             // Stores user information
};

// Create the authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to log in a user and store their data
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;  
    },
    // Action to log out a user and clear their data
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Export the actions for use in components or middleware
export const { login, logout } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;