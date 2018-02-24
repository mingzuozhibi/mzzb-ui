import { combineReducers } from 'redux'
import { routerReducer, RouterState } from 'react-router-redux'
import { appReducer, AppState } from '../App/reducer'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'

export interface RootState {
  app: AppState
  router: RouterState
  sakura: SakuraState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export const rootReducer = combineReducers({
  app: appReducer,
  router: routerReducer,
  sakura: sakuraReducer,
  adminUser: adminUserReducer,
  adminSakura: adminSakuraReducer,
})

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
}
