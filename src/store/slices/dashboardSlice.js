import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { ENDPOINTS } from '@/constants'

export const fetchStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(ENDPOINTS.STATS)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load stats')
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchStats.fulfilled, (state, { payload }) => { state.loading = false; state.stats = payload })
      .addCase(fetchStats.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })
  },
})

export default dashboardSlice.reducer
