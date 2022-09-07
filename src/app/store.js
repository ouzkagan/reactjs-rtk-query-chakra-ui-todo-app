import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cakeReducer from '../features/cake/cakeSlice';
import userReducer from '../features/user/userSlice';
import { apiSlice } from "../features/api/apiSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';


// WHITELIST
const persistConfig = {
  key: 'root',
  storage: storage,
  // whitelist: ['user'] // only navigation will be persisted
};

const rootReducer = combineReducers({
  // user: userReducer,
  user: persistReducer(persistConfig, userReducer),
  cake: cakeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
})


const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',

})
export const persistor = persistStore(store)

export default store

// export default () => {
//   let store = createStore(persistedReducer)
//   let persistor = persistStore(store)
//   return { store, persistor }
// }