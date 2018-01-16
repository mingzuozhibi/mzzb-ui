import {ACTION_UPDATE_SAKURA} from './constant'

const initState = {
  sakuraLists: []
}

function sakuraReducer(state = {...initState}, action) {
  switch (action.type) {
    case ACTION_UPDATE_SAKURA:
      return {...state, sakuraLists: action.data}
    default:
      return state
  }
}

export default sakuraReducer
