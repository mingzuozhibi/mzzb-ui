import { AnyAction } from 'redux'
import { call, put, select } from 'redux-saga/effects'
import { sessionManager } from '../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'
import { RootState } from '../common/root-reducer'

export interface Reload {
  loading: boolean
  refresh: string
  action?: AnyAction
}

export interface Session {
  userName: string
  isLogged: boolean
  userRoles: string[]
}

export interface AppState {
  title: string
  reload?: Reload
  session: Session
  viewSider: boolean
  viewLogin: boolean
  submiting: boolean
}

const initSession = {
  userName: 'Guest',
  isLogged: false,
  userRoles: [],
}

const initState: AppState = {
  title: '名作之壁吧',
  session: initSession,
  viewSider: true,
  viewLogin: false,
  submiting: false,
}

const regExp = new RegExp(/^(\w+)(Request|Succeed|Failed)$/)

function checkSagas(type: string, draft: AppState) {
  if (draft.reload) {
    const matcher = regExp.exec(type)
    if (matcher && matcher.length) {
      if (matcher[1] === draft.reload.refresh) {
        switch (matcher[2]) {
          case 'Request':
            draft.reload.loading = true
            break
          default:
            draft.reload.loading = false
        }
      }
    }
  }
}

export const appReducer = (state: AppState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    checkSagas(action.type, draftState)
    switch (action.type) {
      case 'setViewSider':
        draftState.viewSider = action.viewSider
        break
      case 'setViewLogin':
        draftState.viewLogin = action.viewLogin
        break
      case 'setReload':
        draftState.reload = action.reload
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
    yield put({type: 'sessionSucceed', session: result.data})
  } else {
    yield put({type: 'sessionFailed', title: '获取当前登入状态异常', content: result.message})
  }
}

function* sessionLogin(action: AnyAction) {
  const result = yield call(sessionManager.login, action.username, action.password)
  if (result.success) {
    yield put({type: 'sessionSucceed', session: result.data, message: '你已成功登入'})
    const reload = yield select((state: RootState) => state.app.reload)
    if (reload) {
      yield put({type: `${reload.refresh}Request`})
    }
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

export const appFetcher = {sessionQuery, sessionLogin, sessionLogout}

export function setReload(refresh: string, action?: AnyAction) {
  return {type: 'setReload', reload: {loading: false, refresh, action}}
}
