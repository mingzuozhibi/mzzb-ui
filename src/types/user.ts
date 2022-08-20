export interface IUser {
  id: number
  enabled: boolean
  username: string
  registerDate: string
  lastLoggedIn: string | undefined
}

export interface ISession {
  userName: string
  userRoles: string[]
  userCount: number
  hasBasic: boolean
  hasAdmin: boolean
}
