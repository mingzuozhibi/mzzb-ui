import { all, takeEvery } from 'redux-saga/effects'
import { sessionSaga } from './reducers/session'

export function* sagas() {
  yield all([
    takeEvery('sessionQueryRequest', sessionSaga.sessionQuery),
    takeEvery('sessionLoginRequest', sessionSaga.sessionLogin),
    takeEvery('sessionLogoutRequest', sessionSaga.sessionLogout),
  ])
}