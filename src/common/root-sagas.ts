import { all, takeEvery } from 'redux-saga/effects'
import { appSaga } from '../App/reducer'
import { discSaga } from '../components/disc/reducer'
import { sakuraSaga } from '../components/sakura/reducer'
import { currentSaga } from './reducers/current'
import { topdiscSaga } from '../components/topdisc/reducer'
import { adminUserSaga } from '../components/admin-user/reducer'
import { adminSakuraSaga } from '../components/admin-sakura/reducer'
import { LOCATION_CHANGE } from 'connected-react-router'

export function* rootSagas() {
  yield all([
    takeEvery('sessionQueryRequest', appSaga.sessionQuery),
    takeEvery('sessionLoginRequest', appSaga.sessionLogin),
    takeEvery('sessionLogoutRequest', appSaga.sessionLogout),

    takeEvery('viewDiscRequest', discSaga.viewModel),
    takeEvery('editDiscRequest', discSaga.editModel),

    takeEvery('view(records)DiscRequest', discSaga.viewRecords),
    takeEvery('merge(ranks)DiscRequest', discSaga.mergeRanks),
    takeEvery('merge(pts)DiscRequest', discSaga.mergePts),

    takeEvery('listSakuraRequest', sakuraSaga.listModel),
    takeEvery('view(discs)SakuraRequest', sakuraSaga.viewDiscs),

    takeEvery(LOCATION_CHANGE, currentSaga.updateReload),
    takeEvery('reloadRequest', currentSaga.invokeReload),

    takeEvery('listTopDiscRequest', topdiscSaga.listModel),

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
