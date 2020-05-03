import { all, takeEvery } from 'redux-saga/effects'
import { loginRequest, tokenRequest, logoutRequest } from './@version/token'

export function* sagas() {
  yield all([
    takeEvery('token_request', tokenRequest),
    takeEvery('login_request', loginRequest),
    takeEvery('logout_request', logoutRequest),
  ])
}
