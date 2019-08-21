import { combineReducers } from 'redux'
import { PageInfo } from './route-infos'
import { appReducer, AppState } from '../App/reducer'
import { connectRouter, RouterState } from 'connected-react-router'
import { currentReducer, CurrentState } from './reducers/current'
import { topdiscReducer, TopDiscState } from '../components/topdisc/reducer'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'

export interface RootState {
  app: AppState
  router: RouterState
  current: CurrentState
  topdisc: TopDiscState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export function createRootReducer(history: any) {
  return combineReducers({
    app: appReducer,
    router: connectRouter(history),
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
