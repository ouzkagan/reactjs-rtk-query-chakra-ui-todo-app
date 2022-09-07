import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
  loading:false,
  user: {},
  error: ''
}


export const fetchUser = createAsyncThunk('user/fetchUser', ()=>{
  return axios
  .get('https://jsonplaceholder.typicode.com/users/1')
  .then((response)=> response.data)
})

const userSlice = createSlice({
  name: 'user',
  reducers: {
    login: (state, action) =>{
      state.user  = action.payload
    },
    logout: (state) => {
      state.user = {}
    }
  },
  initialState,
  extraReducers: builder => {
    builder.addCase(fetchUser.pending, (state)=>{
      state.loading = true
    })
    builder.addCase(fetchUser.fulfilled, (state, action)=>{
      state.loading = false
      state.user = action.payload
    })
    builder.addCase(fetchUser.rejected, (state, action)=>{
      state.loading = false
      state.error = action.error.message
    })
  }
})


export default userSlice.reducer
export const { login, logout} = userSlice.actions

