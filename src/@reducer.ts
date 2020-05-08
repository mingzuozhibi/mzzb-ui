import { combineReducers } from 'redux'
import { adminReducer, AdminState } from './reducers/admin'
import { connectRouter, RouterState } from 'connected-react-router'
import { layoutReducer, LayoutState } from './reducers/layout'
import { tokenReducer, TokenState } from './reducers/token'

export interface RootState {
  admin: AdminState
  router: RouterState
  layout: LayoutState
  token: TokenState
}

export function createRootReducer(history: any) {
  return combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    layout: layoutReducer,
    token: tokenReducer,
  })
}
