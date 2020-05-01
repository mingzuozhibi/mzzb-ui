import { combineReducers } from 'redux'
import { adminReducer, AdminState } from './reducers/admin'
import { connectRouter, RouterState } from 'connected-react-router'
import { layoutReducer, LayoutState } from './reducers/layout'
import { sessionReducer, SessionState } from './reducers/session'
import { Token, tokenReducer } from './@version/token'

export interface RootState {
  admin: AdminState
  router: RouterState
  layout: LayoutState
  session: SessionState
  token: Token
}

export function createRootReducer(history: any) {
  return combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    layout: layoutReducer,
    session: sessionReducer,
    token: tokenReducer,
  })
}
