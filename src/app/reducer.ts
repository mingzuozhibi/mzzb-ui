import { adminReducer, AdminState } from '#F/admin'
import { layoutReducer, LayoutState } from '#F/layout'
import { sessionReducer, SessionState } from '#F/session'
import { combineReducers } from 'redux'

export interface RootState {
  admin: AdminState
  layout: LayoutState
  session: SessionState
}

export function createRootReducer() {
  return combineReducers({
    admin: adminReducer,
    layout: layoutReducer,
    session: sessionReducer,
  })
}
