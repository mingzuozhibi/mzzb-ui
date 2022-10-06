import { configureStore } from '@reduxjs/toolkit'

import { layoutReducer } from '#DF/layout'
import { localReducer } from '#DF/local'
import { sessionReducer } from '#DF/session'

export const store = configureStore({
  reducer: {
    local: localReducer,
    layout: layoutReducer,
    session: sessionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
