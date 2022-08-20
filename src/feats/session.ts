import { sessionManager } from '#U/manager'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { message as Msg, Modal } from 'antd'
import { setViewLogin } from './layout'

export interface ISession {
  userName: string
  userRoles: string[]
  userCount: number
  hasBasic: boolean
  hasAdmin: boolean
}

export interface SessionState extends ISession {
  isLogged: boolean
  submiting: boolean
}

const initialState: SessionState = {
  userName: 'Guest',
  isLogged: false,
  userRoles: ['NONE'],
  submiting: false,
  userCount: 0,
  hasBasic: false,
  hasAdmin: false,
}

type SuccessAction = PayloadAction<{
  session: ISession
  message?: string
}>

type FailedAction = PayloadAction<{
  title: string
  content: string
}>

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionSucceed: (state, action: SuccessAction) => {
      const { session, message } = action.payload
      if (message && !state.isLogged) Msg.success(message)
      return { ...session, isLogged: session.hasBasic, submiting: false }
    },
    sessionFailed: (state, action: FailedAction) => {
      const { title, content } = action.payload
      Modal.error({ title, content })
      state.submiting = false
    },
    sessionReset: (state) => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sessionLogin.pending, (state) => {
      state.submiting = true
    })
  },
})

const { sessionSucceed, sessionFailed, sessionReset } = sessionSlice.actions

export const sessionQuery = createAsyncThunk('session/query', async (_, thunkAPI) => {
  const result = await sessionManager.query()
  if (result.success) {
    thunkAPI.dispatch(sessionSucceed({ session: result.data! }))
  } else {
    thunkAPI.dispatch(sessionFailed({ title: '获取当前登入状态异常', content: result.message! }))
  }
})

interface LoginParams {
  username: string
  password: string
}

export const sessionLogin = createAsyncThunk(
  'session/login',
  async (params: LoginParams, thunkAPI) => {
    const result = await sessionManager.login(params.username, params.password)
    if (result.success) {
      thunkAPI.dispatch(setViewLogin(false))
      thunkAPI.dispatch(sessionSucceed({ session: result.data!, message: '你已成功登入' }))
    } else {
      thunkAPI.dispatch(sessionFailed({ title: '登入错误', content: result.message! }))
    }
  }
)

export const sessionLogout = createAsyncThunk('session/logout', async (_, thunkAPI) => {
  const result = await sessionManager.logout()
  if (result.success) {
    thunkAPI.dispatch(sessionSucceed({ session: result.data!, message: '你已成功登出' }))
  } else {
    thunkAPI.dispatch(sessionFailed({ title: '登出错误', content: result.message! }))
    thunkAPI.dispatch(sessionReset())
  }
})

export const sessionReducer = sessionSlice.reducer
