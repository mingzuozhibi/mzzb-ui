import { LocationChangeAction } from 'react-router-redux'
import { AnyAction } from 'redux'
import { put, select } from 'redux-saga/effects'
import { RootState } from '../common/root-reducer'
import { simpleRoutes } from '../index'
import { Simple } from '../common/route-infos'
import produce from 'immer'

export interface CurrentState {
  loading: boolean
  action: string
  param?: {}
  route: Simple
}

const regExp = new RegExp(/^(\w+)(Request|Succeed|Failed)$/)

function checkSagas(type: string, draft: CurrentState) {
  if (draft) {
    const matcher = regExp.exec(type)
    if (matcher && matcher.length) {
      if (matcher[1] === draft.action) {
        switch (matcher[2]) {
          case 'Request':
            draft.loading = true
            break
          default:
            draft.loading = false
        }
      }
    }
  }
}

export const currentReducer = (state: CurrentState = null!, action: AnyAction) => {
  if (state) {
    state = produce(state, draftState => {
      checkSagas(action.type, draftState)
    })
  }
  switch (action.type) {
    case 'updateCurrent':
      return action.current
    default:
      return state
  }
}

function* updateCurrent({payload}: LocationChangeAction) {
  const pathname = payload.pathname
  const route = simpleRoutes.find(r => pathname.startsWith(r.path))
  if (route) {
    if (route.model) {
      if (route.search && route.path !== pathname) {
        const search = route.search
        const value = pathname.substring(route.path.length + 1)
        yield put(_updateCurrent(`view${route.model}`, route, {search, value}))
      } else {
        yield put(_updateCurrent(`list${route.model}`, route))
      }
      yield reloadCurrent()
    } else {
      yield put(_clearCurrent())
    }
  }
}

function* reloadCurrent() {
  const current = yield select((state: RootState) => state.current)
  if (current) {
    yield put({type: `${current.action}Request`, ...current.param})
  }
}

export const currentSaga = {updateCurrent, reloadCurrent}

export function _updateCurrent(action: string, route: Simple, param?: {}) {
  return {type: 'updateCurrent', current: {loading: false, action, route, param}}
}

export function _clearCurrent() {
  return {type: 'updateCurrent', current: undefined}
}
