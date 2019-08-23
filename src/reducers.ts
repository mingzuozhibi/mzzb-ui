import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { layoutReducer, LayoutState } from './layout/layout'
import { sessionReducer, SessionState } from './layout/session'
import { adminReducer, AdminState } from './pages/admin'

export interface RootState {
  admin: AdminState
  router: RouterState
  layout: LayoutState
  session: SessionState
}

export function createRootReducer(history: any) {
  return combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    layout: layoutReducer,
    session: sessionReducer
  })
}
