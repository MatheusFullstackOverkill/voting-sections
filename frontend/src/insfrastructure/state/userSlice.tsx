import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userdata: {
      user_id: null,
      full_name: '',
      email: '',
      cpf: ''
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.userdata = action.payload;
    }
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer