const ACTION_SESSION_LOGIN = '@@session/SESSION_LOGIN'
const ACTION_SESSION_LOGOUT = '@@session/SESSION_LOGOUT'

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

const initState = {
  isLogged: false
}

function sessionReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_SESSION_LOGIN:
      const {userName, authRole} = action
      return {isLogged: true, userName, authRole}
    case ACTION_SESSION_LOGOUT:
      return {isLogged: false}
    default:
      return state
  }
}

export {sessionLogin, sessionLogout, sessionReducer}
