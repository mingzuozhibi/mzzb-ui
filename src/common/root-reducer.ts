import { combineReducers } from 'redux'
import { PageInfo } from './route-infos'
import { appReducer, AppState } from '../App/reducer'
import { discReducer, DiscState } from '../components/disc/reducer'
import { routerReducer, RouterState } from 'react-router-redux'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'
import { currentReducer, CurrentState } from './reducers/current'
import { newdiscReducer, NewDiscState } from '../components/newdisc/reducer'
import { topdiscReducer, TopDiscState } from '../components/topdisc/reducer'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'

export interface RootState {
  app: AppState
  disc: DiscState
  router: RouterState
  sakura: SakuraState
  current: CurrentState
  newdisc: NewDiscState
  topdisc: TopDiscState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export const rootReducer = combineReducers({
  app: appReducer,
  disc: discReducer,
  router: routerReducer,
  sakura: sakuraReducer,
  current: currentReducer,
  newdisc: newdiscReducer,
  topdisc: topdiscReducer,
  adminUser: adminUserReducer,
  adminSakura: adminSakuraReducer,
})

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
  pageInfo: PageInfo
}
