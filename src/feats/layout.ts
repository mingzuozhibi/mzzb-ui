import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface LayoutState {
  viewSider: boolean
  viewLogin: boolean
}

const initialState: LayoutState = {
  viewSider: false,
  viewLogin: false,
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setViewSider: (state, action: PayloadAction<boolean>) => {
      state.viewSider = action.payload
    },
    setViewLogin: (state, action: PayloadAction<boolean>) => {
      state.viewLogin = action.payload
    },
  },
})

export const { setViewSider, setViewLogin } = layoutSlice.actions

export const layoutReducer = layoutSlice.reducer
