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

  findOne = (key: string, value: string | number, query?: string): Promise<Result<T>> => {
    if (query) {
      return request(`${this.path}/${key}/${value}?${query}`)
    } else {
      return request(`${this.path}/${key}/${value}`)
    }
  }

  addOne = (t: any, query?: string): Promise<Result<T>> => {
    const props = {method: 'post', body: JSON.stringify(t)}
    if (query) {
      return request(`${this.path}?${query}`, props)
    } else {
      return request(`${this.path}`, props)
    }
  }

  getOne = (id: number, query?: string): Promise<Result<T>> => {
    if (query) {
      return request(`${this.path}/${id}?${query}`)
    } else {
      return request(`${this.path}/${id}`)
    }
  }

  setOne = (id: number, t: any, query?: string): Promise<Result<T>> => {
    const props = {method: 'post', body: JSON.stringify(t)}
    if (query) {
      return request(`${this.path}/${id}?${query}`, props)
    } else {
      return request(`${this.path}/${id}`, props)
    }
  }

  delOne = (id: number, query?: string): Promise<Result<T>> => {
    const props = {method: 'delete'}
    if (query) {
      return request(`${this.path}/${id}?${query}`, props)
    } else {
      return request(`${this.path}/${id}`, props)
    }
  }

  listPush = (id: number, pkey: string, pid: number, query?: string): Promise<Result<T>> => {
    const props = {method: 'post'}
    if (query) {
      return request(`${this.path}/${id}/${pkey}/${pid}?${query}`, props)
    } else {
      return request(`${this.path}/${id}/${pkey}/${pid}`, props)
    }
  }

  listDrop = (id: number, pkey: string, pid: number, query?: string): Promise<Result<T>> => {
    const props = {method: 'delete'}
    if (query) {
      return request(`${this.path}/${id}/${pkey}/${pid}?${query}`, props)
    } else {
      return request(`${this.path}/${id}/${pkey}/${pid}`, props)
    }
  }

}

export const md5Password = (username: string, password: string) => {
  return md5(username + md5(password))
}

export const sessionManager = {
  query: () => {
    return request('/api/session', {
      headers: {
        ['X-AUTO-LOGIN']: localStorage['X-AUTO-LOGIN']
      }
    })
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
