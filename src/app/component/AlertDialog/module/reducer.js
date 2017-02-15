import { ACTION_SHOW_ALERT, ACTION_HIDE_ALERT } from './constant'

const initState = {
  isOpened: false
}

function alertReducer(state = {...initState}, action) {
  switch (action.type) {
    case ACTION_SHOW_ALERT:
      const {message} = action
      return {...state, isOpened: true, message}
    case ACTION_HIDE_ALERT:
      return {...state, isOpened: false}
    default:
      return state
  }
}

export default alertReducer
