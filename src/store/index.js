import { configureStore } from '@reduxjs/toolkit'
import authReducer    from './slices/authSlice'
import chequesReducer from './slices/chequesSlice'

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    cheques: chequesReducer,
  },
})
