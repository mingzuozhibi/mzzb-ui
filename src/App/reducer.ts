import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { sessionManager } from '../utils/manager'
import { message, Modal } from 'antd'
import { currentSaga } from '../common/reducers/current'
import produce from 'immer'

export interface Session {
  userName: string
  isLogged: boolean
  userRoles: string[]
}

export interface AppState {
  title: string
  session: Session
  viewSider: boolean
  viewLogin: boolean
  submiting: boolean
}

const initSession = {
  userName: 'Guest',
  isLogged: false,
  userRoles: ['NONE'],
}

const initState: AppState = {
  title: '名作之壁吧',
  session: initSession,
  viewSider: false,
  viewLogin: false,
  submiting: false,
}

export const appReducer = (state: AppState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case 'setViewSider':
        draftState.viewSider = action.viewSider
        break
      case 'setViewLogin':
        draftState.viewLogin = action.viewLogin
        break
      case 'sessionLoginRequest':
        draftState.submiting = true
        break
      case 'sessionSucceed':
        draftState.session = action.session
        draftState.submiting = false
        draftState.viewLogin = false
        if (action.message) {
          message.success(action.message)
        }
        break
      case 'sessionFailed':
        draftState.submiting = false
        if (action.title && action.content) {
          Modal.error({title: action.title, content: action.content})
        }
        break
      default:
    }
  })
}

function* sessionQuery() {
  const result = yield call(sessionManager.query)
  if (result.success) {
    if (result.data.isLogged) {
      yield put({type: 'sessionSucceed', session: result.data, message: '你已成功登入'})
      yield currentSaga.invokeReload()
    } else {
      yield put({type: 'sessionSucceed', session: result.data})
    }
  } else {
    yield put({type: 'sessionFailed', title: '获取当前登入状态异常', content: result.message})
  }
}

function* sessionLogin(action: AnyAction) {
  const result = yield call(sessionManager.login, action.username, action.password)
  if (result.success) {
    yield put({type: 'sessionSucceed', session: result.data, message: '你已成功登入'})
    yield currentSaga.invokeReload()
  } else {
    yield put({type: 'sessionFailed', title: '登入错误', content: result.message})
  }
}

function* sessionLogout() {
  const result = yield call(sessionManager.logout)
  if (result.success) {
    yield put({type: 'sessionSucceed', session: result.data, message: '你已成功登出'})
  } else {
    yield put({type: 'sessionFailed', title: '登出错误', content: result.message})
  }
}

export const appSaga = {sessionQuery, sessionLogin, sessionLogout}
