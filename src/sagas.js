import {takeLatest} from 'redux-saga/effects'

import {sakuraSagas} from './reducers/sakuraReducer'
import {userSagas} from './reducers/userReducer'

export default function* mySage() {
  const sagas = [...sakuraSagas, ...userSagas]
  for (let i = 0; i < sagas.length; i++) {
    const [action, fetcher] = sagas[i]
    yield takeLatest(action, fetcher)
  }
}
