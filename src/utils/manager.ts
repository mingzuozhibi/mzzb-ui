import request from './request'
import * as md5 from 'md5'

export interface BaseModel {
  id: number
}

type Result1<T> = {
  success: true
  data: T
}

type Result2 = {
  success: false
  message: string
}

export type Result<T> = Result1<T> | Result2

export class Manager<T extends BaseModel> {

  private path: string

  constructor(path: string) {
    this.path = path
  }

  findAll = (query?: string): Promise<Result<T[]>> => {
    if (query) {
      return request(`${this.path}?${query}`)
    } else {
      return request(this.path)
    }
  }

  getOne = (id: number): Promise<Result<T>> => {
    return request(`${this.path}/${id}`)
  }

  addOne = (t: any): Promise<Result<T>> => {
    return request(this.path, {method: 'post', body: JSON.stringify(t)})
  }

  delOne = (id: number): Promise<Result<T>> => {
    return request(`${this.path}/${id}`, {method: 'delete'})
  }

  update = (t: any): Promise<Result<T>> => {
    return request(`${this.path}/${t.id}`, {method: 'post', body: JSON.stringify(t)})
  }

}

export const md5Password = (username: string, password: string) => {
  return md5(username + md5(password))
}

export const loginManager = {
  current: () => {
    return request('/api/session')
  },
  login: (username: string, password: string) => {
    password = md5Password(username, password)
    return request('/api/session/login', {
      method: 'post',
      body: JSON.stringify({username, password}),
    })
  },
  logout: () => {
    return request('/api/session/logout', {
      method: 'post',
    })
  },
}
