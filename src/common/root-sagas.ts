import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { appSaga } from '../App/reducer'
import { listSaga } from '../components/list/reducer'
import { currentSaga } from './reducers/current'
import { adminUserSaga } from '../components/admin-user/reducer'
import { LOCATION_CHANGE } from 'react-router-redux'

export function* rootSagas() {
  yield all([
    takeLatest('sessionQueryRequest', appSaga.sessionQuery),
    takeLatest('sessionLoginRequest', appSaga.sessionLogin),
    takeLatest('sessionLogoutRequest', appSaga.sessionLogout),

    takeLatest('findAllListRequest', listSaga.findAll),
    takeLatest('editAllListRequest', listSaga.editAll),
    takeLatest('editOneListRequest', listSaga.editOne),
    takeLatest('find(discs)ListRequest', listSaga.findDiscs),
    takeLatest('edit(discs)ListRequest', listSaga.editDiscs),
    takeEvery('addOneListRequest', listSaga.addOne),
    takeLatest('setOneListRequest', listSaga.setOne),
    takeEvery('push(discs)ListRequest', listSaga.pushDiscs),
    takeEvery('drop(discs)ListRequest', listSaga.dropDiscs),

    takeLatest(LOCATION_CHANGE, currentSaga.updateReload),
    takeLatest('reloadRequest', currentSaga.invokeReload),

    takeLatest('listAdminUserRequest', adminUserSaga.listModel),
    takeLatest('viewAdminUserRequest', adminUserSaga.viewModel),
    takeEvery('saveAdminUserRequest', adminUserSaga.saveModel),
    takeLatest('editAdminUserRequest', adminUserSaga.editModel),
  ])
}
