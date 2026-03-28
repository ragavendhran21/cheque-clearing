import { configureStore } from '@reduxjs/toolkit'
import authReducer      from './slices/authSlice'
import chequesReducer   from './slices/chequesSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    cheques:   chequesReducer,
    dashboard: dashboardReducer,
  },
})
