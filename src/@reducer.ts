import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { layoutReducer, LayoutState } from './reducers/layout'
import { tokenReducer, TokenState } from './reducers/token'
import { adminReducer, AdminState } from './reducers/admin'

export interface RootState {
  router: RouterState
  layout: LayoutState
  token: TokenState
  admin: AdminState
}

export function createRootReducer(history: any) {
  return combineReducers({
    router: connectRouter(history),
    layout: layoutReducer,
    token: tokenReducer,
    admin: adminReducer,
  })
}
