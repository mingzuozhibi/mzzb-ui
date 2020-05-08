import { LOCATION_CHANGE } from 'connected-react-router'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '../@reducer'

export interface LayoutState {
  viewSider: boolean
  viewLogin: boolean
}

const initialState: LayoutState = {
  viewSider: false,
  viewLogin: false,
}

const layoutSlice = createSlice({
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
  extraReducers: (builder) => builder.addCase(LOCATION_CHANGE, () => {
    window.scrollTo(0, 0)
  })
})

export const layoutReducer = layoutSlice.reducer

export const { setViewSider, setViewLogin } = layoutSlice.actions

export function useLayoutSelector<T>(selector: (state: LayoutState) => T) {
  return useSelector((state: RootState) => selector(state.layout))
}
