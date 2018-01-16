const ACTION_SHOW_SIDE_DRAWER = '@@appbar/SHOW_SIDE_DRAWER'
const ACTION_HIDE_SIDE_DRAWER = '@@appbar/HIDE_SIDE_DRAWER'

const ACTION_SHOW_LOGIN_FRAME = '@@appbar/SHOW_LOGIN_FRAME'
const ACTION_HIDE_LOGIN_FRAME = '@@appbar/HIDE_LOGIN_FRAME'

const ACTION_SHOW_ALERT_FRAME = '@@appbar/SHOW_ALERT_FRAME'
const ACTION_HIDE_ALERT_FRAME = '@@appbar/HIDE_ALERT_FRAME'

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

const initState = {
  sideDrawerOpen: false,
  loginFrameOpen: false,
  alertFrameOpen: false,
}

export function appbarReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_SHOW_SIDE_DRAWER:
      return {...state, sideDrawerOpen: true}
    case ACTION_HIDE_SIDE_DRAWER:
      return {...state, sideDrawerOpen: false}
    case ACTION_SHOW_LOGIN_FRAME:
      return {...state, loginFrameOpen: true}
    case ACTION_HIDE_LOGIN_FRAME:
      return {...state, loginFrameOpen: false}
    case ACTION_SHOW_ALERT_FRAME:
      return {...state, alertFrameOpen: true, alertText: action.alertText}
    case ACTION_HIDE_ALERT_FRAME:
      return {...state, alertFrameOpen: false}
    default:
      return state
  }
}
