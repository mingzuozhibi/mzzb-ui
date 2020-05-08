import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { message } from "antd";
import { RootState } from "../@reducer";
import { setViewLogin } from "./layout";
import request, { Result } from "../funcs/request";

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

export function useTokenSelector<T>(selector: (state: TokenState) => T) {
  return useSelector((state: RootState) => selector(state.token))
}

export function tokenRequest(isUserRequest: boolean) {
  return async (dispatch: Dispatch) => {
    const xToken = localStorage['x-token']
    if (xToken !== undefined) {
      const body = JSON.stringify({ uuid: xToken });
      const result: Result = await request('/api/auth/token', { body })
      if (result.success) {
        dispatch(tokenSuccess(result.data))
      } else {
        dispatch(tokenFailure(result.message))
      }
    } else {
      if (isUserRequest) {
        dispatch(tokenMissing())
      }
    }
  }
}

export function loginRequest(username: string, password: string) {
  return async (dispatch: Dispatch) => {
    const body = JSON.stringify({ username, password });
    const result: Result = await request('/api/auth/login', { body })
    if (result.success) {
      dispatch(setViewLogin(false))
      dispatch(tokenSuccess(result.data))
    } else {
      dispatch(tokenFailure(result.message))
    }
  }
}

export function logoutRequest() {
  return async (dispatch: Dispatch) => {
    dispatch(tokenCleanup())
  }
}
