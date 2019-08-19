import { combineReducers } from 'redux'
import { PageInfo } from './route-infos'
import { appReducer, AppState } from '../App/reducer'
import { discReducer, DiscState } from '../components/disc/reducer'
import { connectRouter, RouterState } from 'connected-react-router'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'
import { currentReducer, CurrentState } from './reducers/current'
import { topdiscReducer, TopDiscState } from '../components/topdisc/reducer'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'

export interface RootState {
  app: AppState
  disc: DiscState
  router: RouterState
  sakura: SakuraState
  current: CurrentState
  topdisc: TopDiscState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export function createRootReducer(history: any) {
  return combineReducers({
    app: appReducer,
    disc: discReducer,
    router: connectRouter(history),
    sakura: sakuraReducer,
    current: currentReducer,
    topdisc: topdiscReducer,
    adminUser: adminUserReducer,
    adminSakura: adminSakuraReducer,
  })
}

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
  pageInfo: PageInfo
}
