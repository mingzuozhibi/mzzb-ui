import { all, takeEvery } from 'redux-saga/effects'
import { appSaga } from './app/reducer'

export function* sagas() {
  yield all([
    takeEvery('sessionQueryRequest', appSaga.sessionQuery),
    takeEvery('sessionLoginRequest', appSaga.sessionLogin),
    takeEvery('sessionLogoutRequest', appSaga.sessionLogout),
  ])
}
