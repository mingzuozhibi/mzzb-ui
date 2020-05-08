import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '../@reducer'
import { Disc } from '../pages/@types'

export interface AdminState {
  toAdds: Disc[]
  fetchCount?: number
  isAdminMode: boolean
}

const initialState: AdminState = {
  toAdds: [],
  isAdminMode: false,
  ...JSON.parse(sessionStorage['adminState'] || '{}')
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    pushToAdds: (state, action: PayloadAction<Disc>) => {
      state.toAdds.unshift(action.payload)
      saveAdminStateToSessionStorage(state)
    },
    dropToAdds: (state, action: PayloadAction<Disc>) => {
      state.toAdds = state.toAdds.filter(t => t.id !== action.payload.id)
      saveAdminStateToSessionStorage(state)
    },
    setAdminMode: (state, action: PayloadAction<boolean>) => {
      state.isAdminMode = action.payload
      saveAdminStateToSessionStorage(state)
    },
    setFetchCount: (state, action: PayloadAction<number>) => {
      state.fetchCount = action.payload
      saveAdminStateToSessionStorage(state)
    },
  }
})

export function useAdminSelector<T>(selector: (state: AdminState) => T) {
  return useSelector((state: RootState) => selector(state.admin))
}

export const adminReducer = adminSlice.reducer

export const { pushToAdds, dropToAdds, setAdminMode, setFetchCount } = adminSlice.actions

function saveAdminStateToSessionStorage(state: AdminState) {
  sessionStorage['adminState'] = JSON.stringify(state)
}
