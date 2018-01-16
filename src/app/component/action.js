import {sessionLogin, sessionLogout} from '../module/session'
import {showAlertFrame} from '../module/appbar'
import {sessionManager} from '../manager'

function submitCheck() {
  return async (dispatch) => {
    try {
      const json = await sessionManager.check()
      if (json.success) {
        dispatch(sessionLogin(json.username, json.roles))
      } else {
        dispatch(sessionLogout())
      }
    } catch (err) {
      dispatch(showAlertFrame(`Error: ${err.message}`))
    }
  }
}

function submitLogin(username, password, action) {
  return async (dispatch) => {
    const json = await sessionManager.login(username, password)
    if (json.success) {
      dispatch(action)
      dispatch(submitCheck())
    } else {
      dispatch(showAlertFrame('Login failed! Check username and password'))
    }
  }
}

function submitLogout() {
  return async (dispatch) => {
    try {
      await sessionManager.logout()
      dispatch(submitCheck())
    } catch (err) {
      dispatch(showAlertFrame(`Error: ${err.message}`))
    }
  }
}

export {submitCheck, submitLogin, submitLogout}
