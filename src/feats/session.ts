import { sessionManager } from '#U/manager'
import { Result } from '#U/request'
import { message, Modal } from 'antd'
import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'

export interface Session {
  userName: string
  isLogged: boolean
  userRoles: string[]
  hasBasic: boolean
  hasAdmin: boolean
}

export interface SessionState extends Session {
  submiting: boolean
  userCount: number
}

const initSession: SessionState = {
  userName: 'Guest',
  isLogged: false,
  userRoles: ['NONE'],
  submiting: false,
  userCount: 0,
  hasBasic: false,
  hasAdmin: false,
}

export const sessionReducer = (state = initSession, action: AnyAction) => {
  switch (action.type) {
    case 'sessionLoginRequest':
      return { ...state, submiting: true }
    case 'sessionSucceed':
      action.message && message.success(action.message)
      return { ...action.session, isLogged: action.session.hasBasic, submiting: false }
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
