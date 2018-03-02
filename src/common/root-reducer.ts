import { combineReducers } from 'redux'
import { appReducer, AppState } from '../App/reducer'
import { listReducer, ListState } from '../components/list/reducer'
import { routerReducer, RouterState } from 'react-router-redux'
import { currentReducer, CurrentState } from './reducers/current'
import { adminUserReducer, AdminUserState } from '../components/admin-user/reducer'
import { PageInfo } from './route-infos'

export { PageInfo }

export interface RootState {
  app: AppState
  list: ListState
  router: RouterState
  current: CurrentState
  adminUser: AdminUserState
}

export const rootReducer = combineReducers({
  app: appReducer,
  list: listReducer,
  router: routerReducer,
  current: currentReducer,
  adminUser: adminUserReducer,
})

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
  pageInfo: PageInfo
}
