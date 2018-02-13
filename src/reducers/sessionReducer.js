import produce from 'immer'

const ACTION_UPDATE_SESSION = '@@session/UPDATE_SESSION'

const initState = {
  isLogged: false,
  isAdmin: false,
}

export default function (state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_UPDATE_SESSION:
        draft.isLogged = action.session.isLogged
        draft.userName = action.session.userName
        draft.userRoles = action.session.userRoles
        draft.isAdmin = action.session.userRoles.filter(role => role === 'ROLE_ADMIN').length > 0
        break
      default:
    }
  })
}

export function updateSession(session) {
  return {
    type: ACTION_UPDATE_SESSION, session
  }
}
