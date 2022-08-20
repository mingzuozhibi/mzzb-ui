import { layoutReducer } from '#F/layout'
import { sessionReducer } from '#F/session'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    session: sessionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
