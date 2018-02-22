import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { sakuraFetcher } from '../components/sakura/reducer'
import { adminUserFetcher } from '../components/admin-user/reducer'
import { adminSakuraFetcher } from '../components/admin-sakura/reducer'

export function* rootSagas() {
  yield all([
    takeLatest('listSakuraRequest', sakuraFetcher.listModel),
    takeLatest('listAdminUserRequest', adminUserFetcher.listModel),
    takeEvery('saveAdminUserRequest', adminUserFetcher.saveModel),
    takeLatest('editAdminUserRequest', adminUserFetcher.editModel),
    takeLatest('listAdminSakuraRequest', adminSakuraFetcher.listModel),
    takeEvery('saveAdminSakuraRequest', adminSakuraFetcher.saveModel),
    takeLatest('editAdminSakuraRequest', adminSakuraFetcher.editModel),
  ])
}
