import { combineReducers } from 'redux'
import { routerReducer, RouterState } from 'react-router-redux'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'

export interface RootState {
  sakura: SakuraState
  router: RouterState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export const rootReducer = combineReducers({
  router: routerReducer,
  sakura: sakuraReducer,
  adminUser: adminUserReducer,
  adminSakura: adminSakuraReducer,
})

export interface BaseState<T> {
  models?: T[]
  errors?: string
}
