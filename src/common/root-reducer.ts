import { combineReducers } from 'redux'
import { appReducer, AppState } from '../App/reducer'
import { routerReducer, RouterState } from 'react-router-redux'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'
import { currentReducer, CurrentState } from './reducers/current'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'
import { PageInfo } from './route-infos'

export { PageInfo }

export interface RootState {
  app: AppState
  router: RouterState
  sakura: SakuraState
  current: CurrentState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export const rootReducer = combineReducers({
  app: appReducer,
  router: routerReducer,
  sakura: sakuraReducer,
  current: currentReducer,
  adminUser: adminUserReducer,
  adminSakura: adminSakuraReducer,
})

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
  pageInfo: PageInfo
}
