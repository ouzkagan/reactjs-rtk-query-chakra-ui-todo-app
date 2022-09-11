import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from "../features/api/apiSlice";
import notificationReducer from '../features/notification/notificationSlice';
import userReducer from '../features/user/userSlice';
import ToastMiddleware from '../middlewares/ToastMiddleware';

// WHITELIST
const persistConfig = {
  key: 'root',
  storage: storage,
  // whitelist: ['user'] // only navigation will be persisted
};

const rootReducer = combineReducers({
  // user: userReducer,
  user: persistReducer(persistConfig, userReducer),
  notifications : notificationReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
})

// @ts-ignore
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware).concat(ToastMiddleware),
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',

})
export const persistor = persistStore(store)

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>

// @ts-ignore
export type RootState = ReturnType<typeof store.getState>


// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// export default () => {
//   let store = createStore(persistedReducer)
//   let persistor = persistStore(store)
//   return { store, persistor }
// }