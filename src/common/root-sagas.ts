import { all, takeLatest } from 'redux-saga/effects'
import { listSakura } from '../components/sakura/reducer'
import { editAdminUser, listAdminUser, saveAdminUser } from '../components/admin-user/reducer'

export function* rootSagas() {
  yield all([
    takeLatest('listSakuraRequest', listSakura),
    takeLatest('listAdminUserRequest', listAdminUser),
    takeLatest('saveAdminUserRequest', saveAdminUser),
    takeLatest('editAdminUserRequest', editAdminUser),
  ])
}
