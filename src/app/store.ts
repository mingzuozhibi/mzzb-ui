import { configureStore } from '@reduxjs/toolkit'

import { layoutReducer } from '#F/layout'
import { localReducer } from '#F/local'
import { sessionReducer } from '#F/session'

export const store = configureStore({
  reducer: {
    local: localReducer,
    layout: layoutReducer,
    session: sessionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
