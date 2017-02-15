import { ACTION_SHOW_LOGIN, ACTION_HIDE_LOGIN } from './constant'

const initState = {
  isOpened: false
}

function loginReducer(state = {...initState}, action) {
  switch (action.type) {
  case ACTION_SHOW_LOGIN:
    return {...state, isOpened: true}
  case ACTION_HIDE_LOGIN:
    return {...state, isOpened: false}
  default:
    return state
  }
}

export default loginReducer
