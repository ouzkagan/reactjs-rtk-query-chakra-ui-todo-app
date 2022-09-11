import { createSlice } from "@reduxjs/toolkit";

import { useAppSelector } from "../../app/hooks/index";
import { RootState } from "../../app/store";

// Define a type for the slice state
interface User {
  username?: string,
  image?:string,
  
}
interface UserState {
  user: User
}

const initialState:UserState = {
  user: {},
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

const selectUser = (state:RootState) => state.user;
const selectIsAuthenticated = (state:RootState) => !!state.user.user.username;
// Hooks
export const useUser = () => useAppSelector(selectUser);
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated);

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;
