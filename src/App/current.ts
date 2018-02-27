import { LocationChangeAction } from 'react-router-redux'
import { AnyAction } from 'redux'
import { put, select } from 'redux-saga/effects'
import { RootState } from '../common/root-reducer'
import { simpleRoutes } from '../index'
import { Simple } from '../common/route-infos'
import produce from 'immer'

interface Reload {
  loading: boolean
  action: string
  param?: {}
}

export interface CurrentState {
  reload?: Reload
  route?: Simple
}

const initState = {}

export const currentReducer = (state: CurrentState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    checkSagas(action.type, draftState)
    switch (action.type) {
      case 'updateCurrent':
        draftState.reload = action.reload
        draftState.route = action.route
        break
      default:
    }
  })
}

function checkSagas(type: string, draft: CurrentState) {
  if (draft.reload) {
    const matcher = /^(\w+)(Request|Succeed|Failed)$/.exec(type)
    if (matcher && matcher.length) {
      if (matcher[1] === draft.reload.action) {
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

function* updateCurrentWithSearch(pathname: string, route: Simple) {
  const action = `view${route.model}`
  const search = route.search

  const split = pathname.substring(route.path.length + 1).split(/[/?]/)
  switch (split[0]) {
    case 'save':
      yield put(_updateCurrent(route))
      break
    case 'edit':
      yield put(_updateCurrent(route, _reload(action, {search, value: split[1]})))
      break
    default:
      yield put(_updateCurrent(route, _reload(action, {search, value: split[0]})))
      break
  }
}

function* updateCurrent({payload}: LocationChangeAction) {
  const pathname = payload.pathname
  const route = simpleRoutes.find(r => pathname.startsWith(r.path))

  if (route) {
    if (route.model) {
      if (route.search && route.path !== pathname) {
        yield updateCurrentWithSearch(pathname, route)
      } else {
        yield put(_updateCurrent(route, _reload(`list${route.model}`)))
      }
      yield reloadCurrent()
    } else {
      yield put(_clearCurrent())
    }
  }
}

function* reloadCurrent() {
  const reload = yield select((state: RootState) => state.current.reload)
  if (reload) {
    yield put({type: `${reload.action}Request`, ...reload.param})
  }
}

export const currentSaga = {updateCurrent, reloadCurrent}

export function _reload(action: string, param?: {}) {
  return {loading: false, action, param}
}

export function _updateCurrent(route: Simple, reload?: Reload) {
  return {type: 'updateCurrent', route, reload}
}

export function _clearCurrent() {
  return {type: 'updateCurrent'}
}
