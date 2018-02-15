import {requestHandler} from '../utils/handler'
import sessionManager from '../services/sessionManager'
import {updateSession} from '../reducers/sessionReducer'
import {hideLogin} from '../reducers/layoutReducer'

export function query() {
  return requestHandler('获取当前用户状态', {
    fetchCall: () => sessionManager.current(),
    fetchDone: (session, dispatch) => {
      dispatch(updateSession(session))
    }
  })
}

export function login(username, password) {
  return requestHandler('登入', {
    fetchCall: () => sessionManager.login(username, password),
    fetchDone: (session, dispatch) => {
      dispatch(hideLogin())
      dispatch(updateSession(session))
    }
  })
}

export function logout() {
  return requestHandler('登出', {
    fetchCall: () => sessionManager.logout(),
    fetchDone: (session, dispatch) => {
      dispatch(updateSession(session))
    }
  })
}
