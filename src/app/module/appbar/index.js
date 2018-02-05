import produce from 'immer'
import {Modal} from 'antd'

const ACTION_SHOW_SIDE_DRAWER = '@@appbar/SHOW_SIDE_DRAWER'
const ACTION_HIDE_SIDE_DRAWER = '@@appbar/HIDE_SIDE_DRAWER'

const ACTION_SHOW_LOGIN_FRAME = '@@appbar/SHOW_LOGIN_FRAME'
const ACTION_HIDE_LOGIN_FRAME = '@@appbar/HIDE_LOGIN_FRAME'

const ACTION_ALERT_INFO = '@@appbar/ALERT_INFO'
const ACTION_ALERT_ERROR = '@@appbar/ALERT_ERROR'
const ACTION_ALERT_WARNING = '@@appbar/ALERT_WARNING'
const ACTION_ALERT_SUCCESS = '@@appbar/ALERT_SUCCESS'

const initState = {
  sideDrawerOpen: false,
  loginFrameOpen: false,
}

export default function appbarReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_SHOW_SIDE_DRAWER:
        draft.sideDrawerOpen = true
        break
      case ACTION_HIDE_SIDE_DRAWER:
        draft.sideDrawerOpen = false
        break
      case ACTION_SHOW_LOGIN_FRAME:
        draft.loginFrameOpen = true
        break
      case ACTION_HIDE_LOGIN_FRAME:
        draft.loginFrameOpen = false
        break
      case ACTION_ALERT_INFO:
        Modal.info({title: action.title, content: action.content})
        break
      case ACTION_ALERT_ERROR:
        Modal.error({title: action.title, content: action.content})
        break
      case ACTION_ALERT_WARNING:
        Modal.warning({title: action.title, content: action.content})
        break
      case ACTION_ALERT_SUCCESS:
        Modal.success({title: action.title, content: action.content})
        break
      default:
    }
  })
}

export function showSideDrawer() {
  return {
    type: ACTION_SHOW_SIDE_DRAWER
  }
}

export function hideSideDrawer() {
  return {
    type: ACTION_HIDE_SIDE_DRAWER
  }
}

export function showLoginFrame() {
  return {
    type: ACTION_SHOW_LOGIN_FRAME
  }
}

export function hideLoginFrame() {
  return {
    type: ACTION_HIDE_LOGIN_FRAME
  }
}

export function alertInfo({title = '信息', content}) {
  return {
    type: ACTION_ALERT_INFO, title, content
  }
}

export function alertError({title = '错误', content}) {
  return {
    type: ACTION_ALERT_ERROR, title, content
  }
}

export function alertWarning({title = '警告', content}) {
  return {
    type: ACTION_ALERT_WARNING, title, content
  }
}

export function alertSuccess({title = '成功', content}) {
  return {
    type: ACTION_ALERT_SUCCESS, title, content
  }
}
