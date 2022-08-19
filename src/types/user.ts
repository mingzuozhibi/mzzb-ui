export interface IUser {
  id: number
  enabled: boolean
  username: string
  registerDate: string
  lastLoggedIn: string | undefined
}
