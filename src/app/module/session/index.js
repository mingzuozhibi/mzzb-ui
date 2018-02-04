import produce from 'immer'

const ACTION_SESSION_LOGIN = '@@session/SESSION_LOGIN'
const ACTION_SESSION_LOGOUT = '@@session/SESSION_LOGOUT'

const initState = {
  isLogged: false
}

export default function sessionReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_SESSION_LOGIN:
        draft.isLogged = true
        draft.userName = action.userName
        draft.authRole = action.authRole
        break
      case ACTION_SESSION_LOGOUT:
        draft.isLogged = false
        draft.userName = undefined
        draft.authRole = undefined
        break
    }
  })
}

export function sessionLogin(userName, authRole) {
  return {
    type: ACTION_SESSION_LOGIN, userName, authRole
  }
}

export function sessionLogout() {
  return {
    type: ACTION_SESSION_LOGOUT
  }
}
