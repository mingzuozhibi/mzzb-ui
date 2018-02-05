import produce from 'immer'

const ACTION_SHOW_SIDE_DRAWER = '@@appbar/SHOW_SIDE_DRAWER'
const ACTION_HIDE_SIDE_DRAWER = '@@appbar/HIDE_SIDE_DRAWER'

const ACTION_SHOW_LOGIN_FRAME = '@@appbar/SHOW_LOGIN_FRAME'
const ACTION_HIDE_LOGIN_FRAME = '@@appbar/HIDE_LOGIN_FRAME'

const ACTION_SHOW_ALERT_FRAME = '@@appbar/SHOW_ALERT_FRAME'
const ACTION_HIDE_ALERT_FRAME = '@@appbar/HIDE_ALERT_FRAME'

const initState = {
  sideDrawerOpen: false,
  loginFrameOpen: false,
  alertFrameOpen: false,
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
      case ACTION_SHOW_ALERT_FRAME:
        draft.alertFrameOpen = true
        draft.alertText = action.alertText
        break
      case ACTION_HIDE_ALERT_FRAME:
        draft.alertFrameOpen = false
        draft.alertText = undefined
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

export function showAlertFrame(alertText) {
  return {
    type: ACTION_SHOW_ALERT_FRAME, alertText
  }
}

export function hideAlertFrame() {
  return {
    type: ACTION_HIDE_ALERT_FRAME
  }
}
