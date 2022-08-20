import { sessionSaga } from '#F/session'
import { all, takeEvery } from 'redux-saga/effects'

export function* sagas() {
  yield all([
    takeEvery('sessionQueryRequest', sessionSaga.sessionQuery),
    takeEvery('sessionLoginRequest', sessionSaga.sessionLogin),
    takeEvery('sessionLogoutRequest', sessionSaga.sessionLogout),
  ])
}
