import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import { tokenService } from '@/services/tokenService'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(credentials)
    tokenService.set(data.data.token)
    return data.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.signup(payload)
    tokenService.set(data.data.token)
    return data.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed')
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authService.getMe()
    return data.data
  } catch (err) {
    tokenService.remove() // token is stale or invalid — clear it
    return rejectWithValue(err.response?.data?.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout().catch(() => {})
  tokenService.remove()
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
    clearAuth(state)  { state.user = null; state.initialized = true },
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
      .addCase(fetchMe.rejected,  (state) => { state.user = null; state.initialized = true })
    // logout
    builder
      .addCase(logout.fulfilled, (state) => { state.user = null; state.initialized = true })
  },
})

export const { clearError, clearAuth } = authSlice.actions
export default authSlice.reducer
