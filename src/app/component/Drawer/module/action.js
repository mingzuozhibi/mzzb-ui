import {ACTION_SHOW_DRAWER, ACTION_HIDE_DRAWER} from './constant'

export function showDrawer() {
  return {
    type: ACTION_SHOW_DRAWER
  }
}

export function hideDrawer() {
  return {
    type: ACTION_HIDE_DRAWER
  }
}
