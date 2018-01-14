import { UPDATE_SAKURA_DATA } from './constant'

const initState = {
  sakuraLists: []
}

function sakuraReducer(state = {...initState}, action) {
  switch (action.type) {
  case UPDATE_SAKURA_DATA:
    return {...state, sakuraLists: action.data}
  default:
    return state
  }
}

export default sakuraReducer
