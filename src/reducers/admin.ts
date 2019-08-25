import { AnyAction } from 'redux'
import { Disc } from '../pages/@disc/disc'

export interface AdminState {
  toAdds: Disc[]
  fetchCount?: number
  isAdminMode: boolean
}

const initState: AdminState = {
  toAdds: [],
  isAdminMode: false,
  ...JSON.parse(localStorage['adminState'] || '{}')
}

export const adminReducer = (state = initState, action: AnyAction) => {
  switch (action.type) {
    case 'pushToAdds':
      return saveState({...state, toAdds: [action.disc, ...state.toAdds]})
    case 'dropToAdds':
      return saveState({...state, toAdds: state.toAdds.filter(t => t.id !== action.disc.id)})
    case 'setAdminMode':
      return saveState({...state, isAdminMode: action.isAdminMode})
    case 'setFetchCount':
      return saveState({...state, fetchCount: action.fetchCount})
    default:
      return state
  }
}

function saveState(state: AdminState) {
  localStorage['adminState'] = JSON.stringify(state)
  return state
}
