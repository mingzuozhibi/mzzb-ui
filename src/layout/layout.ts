import { AnyAction } from 'redux'
import { LOCATION_CHANGE } from 'connected-react-router'

export interface LayoutState {
  viewSider: boolean
  viewLogin: boolean
}

const initState: LayoutState = {
  viewSider: false,
  viewLogin: false,
}

export const layoutReducer = (state: LayoutState = initState, action: AnyAction) => {
  switch (action.type) {
    case 'setViewSider':
      return {...state, viewSider: action.viewSider}
    case 'setViewLogin':
      return {...state, viewLogin: action.viewLogin}
    case LOCATION_CHANGE:
      window.scrollTo(0, 0)
      return state
    default:
      return state
  }
}
