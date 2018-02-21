import { all, takeLatest } from 'redux-saga/effects'
import { listSakura } from '../components/sakura/reducer'

export function* rootSagas() {
  yield all([
    takeLatest('listSakuraRequest', listSakura)
  ])
}
