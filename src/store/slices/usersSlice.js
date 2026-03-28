import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { ENDPOINTS } from '@/constants'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(ENDPOINTS.USERS)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load users')
  }
})

export const createUser = createAsyncThunk('users/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post(ENDPOINTS.USERS, payload)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create user')
  }
})

export const updateUser = createAsyncThunk('users/update', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const res = await api.put(ENDPOINTS.USER(id), body)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update user')
  }
})

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(ENDPOINTS.USER(id))
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete user')
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list:    [],
    loading: false,
    mutating: false,
    error:   null,
  },
  reducers: {
    clearUsersError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsers.pending,  (state) => { state.loading = true; state.error = null })
      .addCase(fetchUsers.fulfilled,(state, { payload }) => { state.loading = false; state.list = payload })
      .addCase(fetchUsers.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      // create
      .addCase(createUser.pending,  (state) => { state.mutating = true })
      .addCase(createUser.fulfilled,(state, { payload }) => { state.mutating = false; state.list.push(payload) })
      .addCase(createUser.rejected, (state) => { state.mutating = false })
      // update
      .addCase(updateUser.pending,  (state) => { state.mutating = true })
      .addCase(updateUser.fulfilled,(state, { payload }) => {
        state.mutating = false
        const idx = state.list.findIndex(u => u.id === payload.id)
        if (idx !== -1) state.list[idx] = payload
      })
      .addCase(updateUser.rejected, (state) => { state.mutating = false })
      // delete
      .addCase(deleteUser.pending,  (state) => { state.mutating = true })
      .addCase(deleteUser.fulfilled,(state, { payload: id }) => {
        state.mutating = false
        state.list = state.list.filter(u => u.id !== id)
      })
      .addCase(deleteUser.rejected, (state) => { state.mutating = false })
  },
})

export const { clearUsersError } = usersSlice.actions
export default usersSlice.reducer
