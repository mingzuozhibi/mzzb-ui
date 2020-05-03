import { call, put } from "redux-saga/effects";
import { message } from "antd";
import request from "./request";

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
  [extraProps: string]: any
}

export function tokenReducer(state = {}, action: Action) {
  switch (action.type) {
    case 'token_success':
      const token = action.data;
      localStorage['x-token'] = token.uuid
      message.success(`你已成功登入 ${token.user.username}`)
      return token
    case 'token_cleanup':
      return {}
    case 'token_failure':
      message.warning(action.message)
      break
    case 'token_missing':
      message.warning('x-token 不存在')
      break
  }
  return state;
}

export function* tokenRequest({ isUserRequest }: Action) {
  const xToken = localStorage['x-token']
  if (xToken !== undefined) {
    const body = JSON.stringify({ uuid: xToken });
    const result = yield call(request, '/api/auth/token', { body })
    if (result.success) {
      yield put({ type: 'token_success', ...result })
    } else {
      yield put({ type: 'token_failure', ...result })
    }
  } else {
    if (isUserRequest) {
      yield put({ type: 'token_missing' })
    }
  }
}

export function* loginRequest({ username, password }: Action) {
  const body = JSON.stringify({ username, password });
  const result = yield call(request, '/api/auth/login', { body })
  if (result.success) {
    yield put({ type: 'setViewLogin', viewLogin: false })
    yield put({ type: 'token_success', ...result })
  } else {
    yield put({ type: 'token_failure', ...result })
  }
}

export function* logoutRequest() {
  yield put({ type: 'token_cleanup' })
}
