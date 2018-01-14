import ajax from './util/ajax'

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
