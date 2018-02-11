import {takeLatest} from 'redux-saga/effects'
import {fetchSakura, requestSakura} from './reducers/sakuraReducer'
import {fetchAddUser, fetchListUser, requestAddUser, requestListUser} from './reducers/userReducer'

export default function* mySage() {
  yield takeLatest(requestSakura().type, fetchSakura)
  yield takeLatest(requestListUser().type, fetchListUser)
  yield takeLatest(requestAddUser().type, fetchAddUser)
}
