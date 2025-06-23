import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
  name: 'auth_token',
  initialState: {
    auth_token: ''
  },
  reducers: {
    setToken: (state, action) => {
      state.auth_token = action.payload;
    },
  },
})

export const { setToken } = tokenSlice.actions

export default tokenSlice.reducer