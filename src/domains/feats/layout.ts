import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sessionLogin } from './session'

export interface LayoutState {
  viewSider: boolean
  viewLogin: boolean
  submiting: boolean
}

const initialState: LayoutState = {
  viewSider: false,
  viewLogin: false,
  submiting: false,
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setViewSider(state, action: PayloadAction<boolean>) {
      state.viewSider = action.payload
    },
    setViewLogin(state, action: PayloadAction<boolean>) {
      state.viewLogin = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(sessionLogin.pending, (state) => {
      state.submiting = true
    })
    builder.addCase(sessionLogin.fulfilled, (state) => {
      state.submiting = false
      state.viewLogin = false
    })
    builder.addCase(sessionLogin.rejected, (state) => {
      state.submiting = false
    })
  },
})

export const { setViewSider, setViewLogin } = layoutSlice.actions

export const layoutReducer = layoutSlice.reducer
