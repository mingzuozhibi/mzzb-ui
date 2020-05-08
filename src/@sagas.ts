import { all, takeEvery } from 'redux-saga/effects'
import { loginRequestSaga, tokenRequestSaga, logoutRequestSaga, tokenRequest, loginRequest, logoutRequest } from './@version/token'

export function* sagas() {
  yield all([
    takeEvery(tokenRequest.type, tokenRequestSaga),
    takeEvery(loginRequest.type, loginRequestSaga),
    takeEvery(logoutRequest.type, logoutRequestSaga),
  ])
}
