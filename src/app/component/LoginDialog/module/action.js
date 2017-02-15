import { ACTION_SHOW_LOGIN, ACTION_HIDE_LOGIN } from './constant'

export function showLogin() {
  return {
    type: ACTION_SHOW_LOGIN
  }
}

export function hideLogin() {
  return {
    type: ACTION_HIDE_LOGIN
  }
}
