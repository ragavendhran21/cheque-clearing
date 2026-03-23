import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(credentials)
    localStorage.setItem('token', data.token)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.signup(payload)
    localStorage.setItem('token', data.token)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed')
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authService.getMe()
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout().catch(() => {})
  localStorage.removeItem('token')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending,    (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled,  (state, { payload }) => { state.loading = false; state.user = payload; state.initialized = true })
      .addCase(login.rejected,   (state, { payload }) => { state.loading = false; state.error = payload })
    // signup
    builder
      .addCase(signup.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(signup.fulfilled, (state, { payload }) => { state.loading = false; state.user = payload; state.initialized = true })
      .addCase(signup.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })
    // fetchMe
    builder
      .addCase(fetchMe.fulfilled, (state, { payload }) => { state.user = payload; state.initialized = true })
      .addCase(fetchMe.rejected,  (state) => { state.initialized = true })
    // logout
    builder
      .addCase(logout.fulfilled, (state) => { state.user = null })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
