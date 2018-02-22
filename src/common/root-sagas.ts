import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { listSakura } from '../components/sakura/reducer'
import { editAdminUser, listAdminUser, saveAdminUser } from '../components/admin-user/reducer'
import { editAdminSakura, listAdminSakura, saveAdminSakura } from '../components/admin-sakura/reducer'

export function* rootSagas() {
  yield all([
    takeLatest('listSakuraRequest', listSakura),
    takeLatest('listAdminUserRequest', listAdminUser),
    takeLatest('saveAdminUserRequest', saveAdminUser),
    takeLatest('editAdminUserRequest', editAdminUser),
    takeLatest('listAdminSakuraRequest', listAdminSakura),
    takeEvery('saveAdminSakuraRequest', saveAdminSakura),
    takeLatest('editAdminSakuraRequest', editAdminSakura),
  ])
}
