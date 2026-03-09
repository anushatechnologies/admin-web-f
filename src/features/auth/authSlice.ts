import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: { id: number; email: string; role: string } | null;
  isLoggedIn: boolean;
}

// ✅ LOAD FROM localStorage ON STARTUP
const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: null,
  isLoggedIn: !!localStorage.getItem('token'), // ✅ Set true if token exists
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem('token', action.payload.token); // ✅ Save to localStorage
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token'); // ✅ Remove from localStorage
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
