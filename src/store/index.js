import { configureStore } from '@reduxjs/toolkit'
import authReducer          from './slices/authSlice'
import chequesReducer       from './slices/chequesSlice'
import dashboardReducer     from './slices/dashboardSlice'
import businessRulesReducer from './slices/businessRulesSlice'
import usersReducer         from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    cheques:       chequesReducer,
    dashboard:     dashboardReducer,
    businessRules: businessRulesReducer,
    users:         usersReducer,
  },
})
