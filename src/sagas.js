import {takeLatest} from 'redux-saga/effects'
import {fetchSakura, requestSakura} from './reducers/sakuraReducer'

export default function* mySage() {
  yield takeLatest(requestSakura().type, fetchSakura)
}
