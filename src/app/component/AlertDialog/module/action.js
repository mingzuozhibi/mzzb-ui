import {ACTION_SHOW_ALERT, ACTION_HIDE_ALERT} from './constant'

export function showAlert(message) {
  return {
    type: ACTION_SHOW_ALERT, message
  }
}

export function hideAlert() {
  return {
    type: ACTION_HIDE_ALERT
  }
}
