import { configureStore } from "@reduxjs/toolkit";
import cakeReducer from '../features/cake/cakeSlice';
import userReducer from '../features/user/userSlice';
import { apiSlice } from "../features/api/apiSlice";

const store = configureStore({
  reducer: {
    cake: cakeReducer,
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store