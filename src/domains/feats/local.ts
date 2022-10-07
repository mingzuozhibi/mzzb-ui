import { IDisc } from '#DT/disc'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LocalState {
  toAdds: IDisc[]
}

const initialState: LocalState = {
  toAdds: loadToAdds(),
}

function loadToAdds() {
  return JSON.parse(localStorage['local-toadds'] ?? '[]')
}

function saveToAdds(toAdds: IDisc[]) {
  localStorage['local-toadds'] = JSON.stringify(toAdds)
}

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    pushToAdds(state, action: PayloadAction<IDisc>) {
      state.toAdds.unshift(action.payload)
      saveToAdds(state.toAdds)
    },
    dropToAdds(state, action: PayloadAction<IDisc>) {
      state.toAdds = state.toAdds.filter((e) => e.id !== action.payload.id)
      saveToAdds(state.toAdds)
    },
    cleanToAdds(state) {
      state.toAdds = []
      saveToAdds(state.toAdds)
    },
    reoladToAdds(state) {
      state.toAdds = loadToAdds()
      saveToAdds(state.toAdds)
    },
  },
})

export const { pushToAdds, dropToAdds, cleanToAdds, reoladToAdds } = localSlice.actions

export const localReducer = localSlice.reducer
