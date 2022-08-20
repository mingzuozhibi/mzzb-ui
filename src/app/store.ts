import { layoutReducer } from '#F/layout'
import { sessionReducer } from '#F/session'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { sagas } from './sagas'

const sagaMid = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    session: sessionReducer,
  },
  middleware: (getDefault) => getDefault().concat(sagaMid),
})

sagaMid.run(sagas)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
