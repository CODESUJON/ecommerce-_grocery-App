import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartProduct';

export const store = configureStore({
  reducer: {
    user: userReducer, // Maps 'user' state to the userSlice reducer
    product : productReducer,
    cartItem:cartReducer
  },
});
