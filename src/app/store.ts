import { createRootReducer } from '#A/reducer'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { sagas } from './sagas'

const sagaMid = createSagaMiddleware()

export const store = configureStore({
  reducer: createRootReducer(),
  middleware: (getDefault) => getDefault().concat(sagaMid),
})

sagaMid.run(sagas)
