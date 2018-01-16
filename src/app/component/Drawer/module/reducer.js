import {ACTION_SHOW_DRAWER, ACTION_HIDE_DRAWER} from './constant'

const initState = {
  isOpened: false
}

function drawerReducer(state = {...initState}, action) {
  switch (action.type) {
    case ACTION_SHOW_DRAWER:
      return {...state, isOpened: true}
    case ACTION_HIDE_DRAWER:
      return {...state, isOpened: false}
    default:
      return state
  }
}

export default drawerReducer
