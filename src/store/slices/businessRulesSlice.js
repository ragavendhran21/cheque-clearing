import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { businessRulesService } from '@/services/businessRulesService'

export const fetchSchema = createAsyncThunk(
  'businessRules/fetchSchema',
  async (table, { rejectWithValue }) => {
    try {
      const { data } = await businessRulesService.getSchema(table)
      return { table, schema: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load schema')
    }
  }
)

export const fetchRows = createAsyncThunk(
  'businessRules/fetchRows',
  async (table, { rejectWithValue }) => {
    try {
      const { data } = await businessRulesService.getRows(table)
      return { table, rows: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load rows')
    }
  }
)

export const insertRow = createAsyncThunk(
  'businessRules/insertRow',
  async ({ table, row }, { rejectWithValue }) => {
    try {
      await businessRulesService.insert(table, row)
      return row
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Insert failed')
    }
  }
)

export const updateRow = createAsyncThunk(
  'businessRules/updateRow',
  async ({ table, updates, pkValues }, { rejectWithValue }) => {
    try {
      await businessRulesService.update(table, updates, pkValues)
      return { updates, pkValues }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed')
    }
  }
)

export const deleteRow = createAsyncThunk(
  'businessRules/deleteRow',
  async ({ table, pkValues }, { rejectWithValue }) => {
    try {
      await businessRulesService.remove(table, pkValues)
      return pkValues
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed')
    }
  }
)

const businessRulesSlice = createSlice({
  name: 'businessRules',
  initialState: {
    selectedTable: null,
    schema:        [],
    rows:          [],
    loadingSchema: false,
    loadingRows:   false,
    mutating:      false,
    error:         null,
  },
  reducers: {
    selectTable(state, { payload }) { state.selectedTable = payload; state.schema = []; state.rows = [] },
    clearError(state)               { state.error = null },
  },
  extraReducers: (builder) => {
    // fetchSchema
    builder
      .addCase(fetchSchema.pending,    (state) => { state.loadingSchema = true; state.error = null })
      .addCase(fetchSchema.fulfilled,  (state, { payload }) => { state.loadingSchema = false; state.schema = payload.schema })
      .addCase(fetchSchema.rejected,   (state, { payload }) => { state.loadingSchema = false; state.error = payload })
    // fetchRows
    builder
      .addCase(fetchRows.pending,      (state) => { state.loadingRows = true; state.error = null })
      .addCase(fetchRows.fulfilled,    (state, { payload }) => { state.loadingRows = false; state.rows = payload.rows })
      .addCase(fetchRows.rejected,     (state, { payload }) => { state.loadingRows = false; state.error = payload })
    // mutating ops
    builder
      .addCase(insertRow.pending,      (state) => { state.mutating = true; state.error = null })
      .addCase(insertRow.fulfilled,    (state) => { state.mutating = false })
      .addCase(insertRow.rejected,     (state, { payload }) => { state.mutating = false; state.error = payload })
    builder
      .addCase(updateRow.pending,      (state) => { state.mutating = true; state.error = null })
      .addCase(updateRow.fulfilled,    (state) => { state.mutating = false })
      .addCase(updateRow.rejected,     (state, { payload }) => { state.mutating = false; state.error = payload })
    builder
      .addCase(deleteRow.pending,      (state) => { state.mutating = true; state.error = null })
      .addCase(deleteRow.fulfilled,    (state) => { state.mutating = false })
      .addCase(deleteRow.rejected,     (state, { payload }) => { state.mutating = false; state.error = payload })
  },
})

export const { selectTable, clearError } = businessRulesSlice.actions
export default businessRulesSlice.reducer
