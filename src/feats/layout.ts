import { AnyAction } from 'redux'

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
      return { ...state, viewSider: action.viewSider }
    case 'setViewLogin':
      return { ...state, viewLogin: action.viewLogin }
    default:
      return state
  }
}
