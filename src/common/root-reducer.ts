import { combineReducers } from 'redux'
import { appReducer, AppState } from '../App/reducer'
import { listReducer, ListState } from '../components/list/reducer'
import { userReducer, UserState } from '../components/user/reducer'
import { routerReducer, RouterState } from 'react-router-redux'
import { currentReducer, CurrentState } from './reducers/current'
import { PageInfo } from './route-infos'

export { PageInfo }

export interface RootState {
  app: AppState
  list: ListState
  user: UserState
  router: RouterState
  current: CurrentState
}

export const rootReducer = combineReducers({
  app: appReducer,
  list: listReducer,
  user: userReducer,
  router: routerReducer,
  current: currentReducer,
})

export interface BaseState<T> {
  models?: T[]
  detail?: T
  message?: string
  pageInfo: PageInfo
}
