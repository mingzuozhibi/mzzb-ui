import produce from 'immer'
import {isMobile} from '../utils/window'
import {LOCATION_CHANGE} from 'react-router-redux'
import {sakuraIcons} from '../components/Sakura'
import {adminUserIcons} from '../components/AdminUser'

const ACTION_SHOW_SIDER = '@@layout/SHOW_SIDER'
const ACTION_HIDE_SIDER = '@@layout/HIDE_SIDER'

const ACTION_SHOW_LOGIN = '@@layout/SHOW_LOGIN'
const ACTION_HIDE_LOGIN = '@@layout/HIDE_LOGIN'

const initState = {
  showSider: !isMobile(),
  showLogin: false,
}

export default function (state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_SHOW_SIDER:
        draft.showSider = true
        break
      case ACTION_HIDE_SIDER:
        draft.showSider = false
        break
      case ACTION_SHOW_LOGIN:
        draft.showLogin = true
        break
      case ACTION_HIDE_LOGIN:
        draft.showLogin = false
        break
      case LOCATION_CHANGE:
        switch (action.payload.pathname) {
          case '/sakura':
            draft.icons = sakuraIcons
            break
          case '/admin/user':
            draft.icons = adminUserIcons
            break
          default:
            draft.icons = undefined
        }
        break
      default:
    }
  })
}

export function showSider() {
  return {
    type: ACTION_SHOW_SIDER
  }
}

export function hideSider() {
  return {
    type: ACTION_HIDE_SIDER
  }
}

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
