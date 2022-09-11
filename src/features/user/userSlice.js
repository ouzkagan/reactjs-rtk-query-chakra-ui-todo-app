import { createSlice } from "@reduxjs/toolkit";

import { useAppSelector } from "../../app/redux-hooks/index";

const initialState = {
  loading: false,
  user: {},
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {};
    },
  },
});

const selectUser = (state) => state.user;
const selectIsAuthenticated = ({ user }) => !!user.user.username;
// Hooks
export const useUser = () => useAppSelector(selectUser);
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated);

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;
