import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { message, Modal } from 'antd'
import { sessionManager } from '../funcs/manager'
import { Result } from '../funcs/request'

export interface Session {
  userName: string
  isLogged: boolean
  userRoles: string[]
}

export interface SessionState extends Session {
  submiting: boolean
  userCount: number
}

const initSession = {
  userName: 'Guest',
  isLogged: false,
  userRoles: ['NONE'],
  submiting: false,
  userCount: 0
}

export const sessionReducer = (state: SessionState = initSession, action: AnyAction) => {
  switch (action.type) {
    case 'sessionLoginRequest':
      return { ...state, submiting: true }
    case 'sessionSucceed':
      action.message && message.success(action.message)
      const { onlineUserCount: userCount, ...session } = action.session
      return { ...session, userCount, submiting: false }
    case 'sessionFailed':
      Modal.error({ title: action.title, content: action.content })
      return { ...state, submiting: false }
    default:
      return state
  }
}

function* sessionQuery() {
  const result: Result = yield call(sessionManager.query)
  if (result.success) {
    yield put({ type: 'sessionSucceed', session: result.data })
  } else {
    yield put({ type: 'sessionFailed', title: '获取当前登入状态异常', content: result.message })
  }
}

function* sessionLogin(action: AnyAction) {
  const result: Result = yield call(sessionManager.login, action.username, action.password)
  if (result.success) {
    yield put({ type: 'setViewLogin', viewLogin: false })
    yield put({ type: 'sessionSucceed', session: result.data, message: '你已成功登入' })
  } else {
    yield put({ type: 'sessionFailed', title: '登入错误', content: result.message })
  }
}

function* sessionLogout() {
  const result: Result = yield call(sessionManager.logout)
  if (result.success) {
    yield put({ type: 'sessionSucceed', session: result.data, message: '你已成功登出' })
  } else {
    yield put({ type: 'sessionFailed', title: '登出错误', content: result.message })
  }
}

export const sessionSaga = { sessionQuery, sessionLogin, sessionLogout }
