import { ISession } from '#T/user'
import { fetchResult } from '#U/fetch/fetchResult'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface SessionState extends ISession {}

const initialState: SessionState = {
  userName: 'Guest',
  userRoles: ['NONE'],
  userCount: 0,
  hasBasic: false,
  hasAdmin: false,
}

export const sessionQuery = createAsyncThunk('session/query', async () => {
  const token = localStorage['session-token']
  const result = await fetchResult<SessionState>(`/api/session`, {
    headers: { 'session-token': token },
  })
  return result.data!
})

interface LoginParams {
  username: string
  password: string
}

export const sessionLogin = createAsyncThunk('session/login', async (params: LoginParams) => {
  const result = await fetchResult<SessionState>(`/api/session`, {
    method: 'POST',
    body: JSON.stringify(params),
    failureName: '登入失败',
    successText: '你已成功登入',
  })
  return result.data!
})

export const sessionLogout = createAsyncThunk('session/logout', async () => {
  const result = await fetchResult<SessionState>(`/api/session`, {
    method: 'DELETE',
  })
  return result.data!
})

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sessionQuery.fulfilled, (_, action) => action.payload)
    builder.addCase(sessionLogin.fulfilled, (_, action) => action.payload)
    builder.addCase(sessionLogout.fulfilled, (_, action) => action.payload)
    builder.addCase(sessionLogout.rejected, (state) => {
      return { ...initialState, userCount: state.userCount }
    })
  },
})

export const sessionReducer = sessionSlice.reducer
