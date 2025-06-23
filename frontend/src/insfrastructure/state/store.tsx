import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from './tokenSlice';
import userReducer from './userSlice';

export default configureStore({
  reducer: {
    auth_token: tokenReducer,
    user: userReducer
  }
})