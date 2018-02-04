import ajax from './util/ajax'
import {showAlertFrame} from './module/appbar'

export const sessionManager = {
  check() {
    return ajax('/api/session')
  },
  login(username, password) {
    return ajax('/api/session', {
      method: 'post',
      body: {username, password},
    })
  },
  logout() {
    return ajax('/api/session', {
      method: 'delete',
    })
  },
}

export const discManager = {
  sakuraLists() {
    return ajax('/api/sakura')
  }
}

export function fetchHandler({fetchCall, fetchDone}) {
  return async (dispatch) => {
    try {
      fetchDone(await fetchCall(), dispatch)
    } catch (err) {
      dispatch(showAlertFrame(`Error: ${err.message}`))
    }
  }
}
