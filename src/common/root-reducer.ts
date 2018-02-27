import { combineReducers } from 'redux'
import { routerReducer, RouterState } from 'react-router-redux'
import { appReducer, AppState } from '../App/reducer'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'
import { publicReducer, PublicState } from '../components/public/reducer'
import { currentReducer, CurrentState } from './reducers/current'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { adminSakuraReducer, AdminSakuraState } from '../components/admin-sakura/reducer'

export interface RootState {
  app: AppState
  router: RouterState
  sakura: SakuraState
  public: PublicState
  current: CurrentState
  adminUser: AdminUserState
  adminSakura: AdminSakuraState
}

export const rootReducer = combineReducers({
  app: appReducer,
  router: routerReducer,
  sakura: sakuraReducer,
  public: publicReducer,
  current: currentReducer,
  adminUser: adminUserReducer,
  adminSakura: adminSakuraReducer,
})

export interface PageInfo {
  pageTitle: string // 管理用户
  matchPath: string // /admin/user
  pageModel: string // AdminUser
  modelName: string // 用户
  searchFor: string // key
  component: () => any
}

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
  pageInfo: PageInfo
}
