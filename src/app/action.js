import {sessionLogin, sessionLogout} from './module/session/index'
import {hideLoginFrame, showAlertFrame} from './module/appbar/index'
import {sessionManager} from './manager'

function fetchHandlerFactory({fetchCall, fetchDone}) {
  return async (dispatch) => {
    try {
      fetchDone(await fetchCall(), dispatch)
    } catch (err) {
      dispatch(showAlertFrame(`Error: ${err.message}`))
    }
  }
}

function submitCheck() {
  return fetchHandlerFactory({
    fetchCall: () => sessionManager.check(),
    fetchDone: (json, dispatch) => {
      if (json.success) {
        dispatch(sessionLogin(json['username'], json['roles']))
      } else {
        dispatch(sessionLogout())
      }
    }
  })
}

function submitLogin(username, password) {
  return fetchHandlerFactory({
    fetchCall: () => sessionManager.login(username, password),
    fetchDone: (json, dispatch) => {
      if (json.success) {
        dispatch(hideLoginFrame())
        dispatch(submitCheck())
      } else {
        dispatch(showAlertFrame('Login failed! Check username and password'))
      }
    }
  })
}

function submitLogout() {
  return fetchHandlerFactory({
    fetchCall: () => sessionManager.logout(),
    fetchDone: (json, dispatch) => {
      dispatch(submitCheck())
    }
  })
}

export {fetchHandlerFactory, submitCheck, submitLogin, submitLogout}
