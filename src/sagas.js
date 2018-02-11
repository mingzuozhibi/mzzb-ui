import {takeLatest} from 'redux-saga/effects'
import {fetchSakura, requestSakura} from './reducers/sakuraReducer'
import {fetchUsers, requestUsers} from './reducers/userReducer'

export default function* mySage() {
  yield takeLatest(requestSakura().type, fetchSakura)
  yield takeLatest(requestUsers().type, fetchUsers)
}
