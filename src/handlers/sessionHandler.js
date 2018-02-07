import {requestHandler} from '../utils/handler'
import sessionManager from '../services/sessionManager'
import {sessionLogin, sessionLogout} from '../reducers/sessionReducer'
import {alertError} from '../utils/window'
import {hideLogin} from '../reducers/layoutReducer'

export function submitCheck() {
  return requestHandler({
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

export function submitLogin(username, password) {
  return requestHandler({
    fetchCall: () => sessionManager.login(username, password),
    fetchDone: (json, dispatch) => {
      if (json.success) {
        dispatch(hideLogin())
        dispatch(submitCheck())
      } else {
        alertError('登入失败', '请检查用户名和密码是否正确')
      }
    }
  })
}

export function submitLogout() {
  return requestHandler({
    fetchCall: () => sessionManager.logout(),
    fetchDone: (json, dispatch) => {
      dispatch(submitCheck())
    }
  })
}
