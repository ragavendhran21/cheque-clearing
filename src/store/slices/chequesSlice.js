import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chequeService } from '@/services/chequeService'

export const uploadCheque = createAsyncThunk('cheques/upload', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await chequeService.upload(formData)
    return data.data.cheque
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed')
  }
})

export const fetchCheques = createAsyncThunk('cheques/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await chequeService.getAll(params)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchChequeById = createAsyncThunk('cheques/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await chequeService.getById(id)
    return data.data.cheque
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const verifyCheque = createAsyncThunk('cheques/verify', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await chequeService.verify(id, payload)
    return data.data.cheque
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const rejectCheque = createAsyncThunk('cheques/reject', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const { data } = await chequeService.reject(id, reason)
    return data.data.cheque
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const chequesSlice = createSlice({
  name: 'cheques',
  initialState: {
    list: [],
    total: 0,
    selected: null,
    uploading: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected(state) { state.selected = null },
    clearError(state)    { state.error = null },
  },
  extraReducers: (builder) => {
    // upload
    builder
      .addCase(uploadCheque.pending,   (state) => { state.uploading = true; state.error = null })
      .addCase(uploadCheque.fulfilled, (state, { payload }) => { state.uploading = false; state.list.unshift(payload) })
      .addCase(uploadCheque.rejected,  (state, { payload }) => { state.uploading = false; state.error = payload })
    // fetchAll
    builder
      .addCase(fetchCheques.pending,   (state) => { state.loading = true })
      .addCase(fetchCheques.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload.cheques; state.total = payload.total })
      .addCase(fetchCheques.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })
    // fetchById
    builder
      .addCase(fetchChequeById.fulfilled, (state, { payload }) => { state.selected = payload })
    // verify / reject — update the item in list
    builder
      .addCase(verifyCheque.fulfilled, (state, { payload }) => {
        state.selected = payload
        const idx = state.list.findIndex(c => c.id === payload.id)
        if (idx !== -1) state.list[idx] = payload
      })
      .addCase(rejectCheque.fulfilled, (state, { payload }) => {
        state.selected = payload
        const idx = state.list.findIndex(c => c.id === payload.id)
        if (idx !== -1) state.list[idx] = payload
      })
  },
})

export const { clearSelected, clearError } = chequesSlice.actions
export default chequesSlice.reducer
