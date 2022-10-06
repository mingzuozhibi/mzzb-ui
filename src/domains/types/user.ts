export interface IUser {
  id: number
  enabled: boolean
  username: string
  registerDate: number
  lastLoggedIn: number | undefined
}

export interface ISession {
  userName: string
  userRoles: string[]
  userCount: number
  hasBasic: boolean
  hasAdmin: boolean
}
