import {takeLatest} from 'redux-saga/effects'
import {fetchListSakura, requestListSakura} from './reducers/sakuraReducer'
import {fetchSaveUser, fetchListUser, requestSaveUser, requestListUser} from './reducers/userReducer'

export default function* mySage() {
  yield takeLatest(requestListSakura().type, fetchListSakura)
  yield takeLatest(requestListUser().type, fetchListUser)
  yield takeLatest(requestSaveUser().type, fetchSaveUser)
}
