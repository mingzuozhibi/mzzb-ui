import { call, put } from "redux-saga/effects";
import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { message } from "antd";
import request, { Result } from "./request";

export interface TokenState {
  loading: boolean
  token?: Token
  roles: {
    isLogin: boolean
    isDiscAdmin: boolean
    isUserAdmin: boolean
    isRootAdmin: boolean
  }
}

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

const initialState: TokenState = {
  loading: false,
  roles: {
    isLogin: false, isDiscAdmin: false, isUserAdmin: false, isRootAdmin: false
  }
}

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    tokenSuccess: (state, action: PayloadAction<Token>) => {
      const token = action.payload;
      state.token = token
      localStorage['x-token'] = token.uuid

      const roles = token.user.roles
      state.roles = {
        isLogin: roles.includes('Login'),
        isDiscAdmin: roles.includes('DiscAdmin'),
        isUserAdmin: roles.includes('UserAdmin'),
        isRootAdmin: roles.includes('RootAdmin'),
      }

      message.success(`你已成功登入 ${token.user.username}`)
    },
    tokenCleanup: (state) => {
      message.success(`你已成功登出 ${state.token?.user.username}`)

      return initialState
    },
    tokenFailure: (_, action: PayloadAction<string>) => {
      message.warning(action.payload)
    },
    tokenMissing: () => {
      message.warning('x-token 不存在')
    }
  }
})

export const tokenReducer = tokenSlice.reducer

export const { tokenSuccess, tokenFailure, tokenCleanup, tokenMissing } = tokenSlice.actions

export type TokenRequestPayload = { isUserRequest: boolean }
export type LoginRequestPayload = { username: string, password: string }

export const tokenRequest = createAction<TokenRequestPayload>('tokenRequest')
export const loginRequest = createAction<LoginRequestPayload>('loginRequest')
export const logoutRequest = createAction('logoutRequest')

export function* tokenRequestSaga({ payload: { isUserRequest } }: PayloadAction<TokenRequestPayload>) {
  const xToken = localStorage['x-token']
  if (xToken !== undefined) {
    const body = JSON.stringify({ uuid: xToken });
    const result: Result = yield call(request, '/api/auth/token', { body })
    if (result.success) {
      yield put(tokenSuccess(result.data))
    } else {
      yield put(tokenFailure(result.message))
    }
  } else {
    if (isUserRequest) {
      yield put(tokenMissing())
    }
  }
}

export function* loginRequestSaga({ payload: { username, password } }: PayloadAction<LoginRequestPayload>) {
  const body = JSON.stringify({ username, password });
  const result: Result = yield call(request, '/api/auth/login', { body })
  if (result.success) {
    yield put({ type: 'setViewLogin', viewLogin: false })
    yield put(tokenSuccess(result.data))
  } else {
    yield put(tokenFailure(result.message))
  }
}

export function* logoutRequestSaga() {
  yield put(tokenCleanup())
}
