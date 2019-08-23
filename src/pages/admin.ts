import { AnyAction } from 'redux'

export interface AdminState {
  isAdminMode: boolean
}

const initState: AdminState = {
  isAdminMode: localStorage['isAdminMode'] === 'true',
}

export const adminReducer = (state = initState, action: AnyAction) => {
  switch (action.type) {
    case 'setAdminMode':
      localStorage['isAdminMode'] = action.isAdminMode
      return {...state, isAdminMode: action.isAdminMode}
    default:
      return state
  }
}
