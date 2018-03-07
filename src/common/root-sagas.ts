import { all, takeEvery } from 'redux-saga/effects'
import { appSaga } from '../App/reducer'
import { discSaga } from '../components/disc/reducer'
import { sakuraSaga } from '../components/sakura/reducer'
import { currentSaga } from './reducers/current'
import { adminUserSaga } from '../components/admin-user/reducer'
import { adminSakuraSaga } from '../components/admin-sakura/reducer'
import { LOCATION_CHANGE } from 'react-router-redux'

export function* rootSagas() {
  yield all([
    takeEvery('sessionQueryRequest', appSaga.sessionQuery),
    takeEvery('sessionLoginRequest', appSaga.sessionLogin),
    takeEvery('sessionLogoutRequest', appSaga.sessionLogout),

    takeEvery('viewDiscRequest', discSaga.viewModel),
    takeEvery('view(ranks)DiscRequest', discSaga.viewRanks),
    takeEvery('editDiscRequest', discSaga.editModel),
    takeEvery('set(record)DiscRequest', discSaga.setRecord),

    takeEvery('listSakuraRequest', sakuraSaga.listModel),
    takeEvery('view(discs)SakuraRequest', sakuraSaga.viewDiscs),

    takeEvery(LOCATION_CHANGE, currentSaga.updateReload),
    takeEvery('reloadRequest', currentSaga.invokeReload),

    takeEvery('listAdminUserRequest', adminUserSaga.listModel),
    takeEvery('viewAdminUserRequest', adminUserSaga.viewModel),
    takeEvery('saveAdminUserRequest', adminUserSaga.saveModel),
    takeEvery('editAdminUserRequest', adminUserSaga.editModel),

    takeEvery('listAdminSakuraRequest', adminSakuraSaga.listModel),
    takeEvery('viewAdminSakuraRequest', adminSakuraSaga.viewModel),
    takeEvery('saveAdminSakuraRequest', adminSakuraSaga.saveModel),
    takeEvery('editAdminSakuraRequest', adminSakuraSaga.editModel),
    takeEvery('dropAdminSakuraRequest', adminSakuraSaga.dropModel),

    takeEvery('view(discs)AdminSakuraRequest', adminSakuraSaga.viewDiscs),
    takeEvery('push(discs)AdminSakuraRequest', adminSakuraSaga.pushDiscs),
    takeEvery('drop(discs)AdminSakuraRequest', adminSakuraSaga.dropDiscs),
    takeEvery('search(discs)AdminSakuraRequest', adminSakuraSaga.searchDisc),
  ])
}
