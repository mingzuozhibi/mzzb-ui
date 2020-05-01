export interface Token {
  id: number
  uuid: string
  accessOn: number
  expireOn: number
  user: User
}

export interface User {
  id: number
  enabled: boolean
  username: string
  createOn: number
  loggedOn: number
  roles: string[]
}

export interface Action {
  type: string
  data: any
}

export function tokenReducer(state = {}, action: Action) {
  switch (action.type) {
    case 'token_update':
      return action.data
    default:
      return state;
  }
}
