import { ACTION_SESSION_LOGIN, ACTION_SESSION_LOGOUT } from './constant'
import { showAlert } from './AlertDialog'
import { sessionManager } from '../manager'

function sessionLogin(userName, authRole) {
  return {
    type: ACTION_SESSION_LOGIN, userName, authRole
  }
}

function sessionLogout() {
  return {
    type: ACTION_SESSION_LOGOUT
  }
}

function submitCheck() {
  return async(dispatch) => {
    try {
      const json = await sessionManager.check()
      if (json.success) {
        dispatch(sessionLogin(json.username, json.roles))
      } else {
        dispatch(sessionLogout())
      }
    } catch (err) {
      dispatch(showAlert(`Error: ${err.message}`))
    }
  }
}

function submitLogin(username, password, action) {
  return async(dispatch) => {
    const json = await sessionManager.login(username, password)
    if (json.success) {
      dispatch(action)
      dispatch(submitCheck())
    } else {
      dispatch(showAlert('Login failed! Check username and password'))
    }
  }
}

function submitLogout() {
  return async(dispatch) => {
    try {
      await sessionManager.logout()
      dispatch(submitCheck())
    } catch (err) {
      dispatch(showAlert(`Error: ${err.message}`))
    }
  }
}

export { submitCheck, submitLogin, submitLogout }
