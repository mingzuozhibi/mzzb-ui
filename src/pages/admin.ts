import { AnyAction } from 'redux'

export interface AdminState {
  isAdminMode: boolean
}

const initState: AdminState = {
  isAdminMode: false,
}

export const adminReducer = (state = initState, action: AnyAction) => {
  switch (action.type) {
    case 'setAdminMode':
      return {...state, isAdminMode: action.isAdminMode}
    default:
      return state
  }
}
