import { put, select } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import { matchPath } from 'react-router'
import { RootState } from '../root-reducer'
import { pageInfos } from '../route-infos'
import produce from 'immer'

export interface Reload {
  loading: boolean
  action: string
  param?: {}
}

export interface CurrentState {
  reload?: Reload
}

const initState = {}

export const currentReducer = (state: CurrentState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    checkSagas(action.type, draftState)
    switch (action.type) {
      case 'updateReload':
        draftState.reload = action.reload
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

function match<T>(pathname: string, path: string) {
  return matchPath<T>(pathname, {path, exact: true})
}

function* updateReload({payload}: any) {
  const pathname: string = payload.pathname
  const state = yield select()
  const pageInfo = findPageInfo(state, pathname)

  if (pageInfo) {
    const search = pageInfo.searchFor
    const model = pageInfo.pageModel
    const path = pageInfo.matchPath

    /**  /sakura  */
    const matchList = match(pathname, path)
    if (matchList) {
      yield put(_updateReload(`list${model}`))
      yield invokeReload()
      return
    }

    /**  /sakura/save  */
    const matchSave = match<{}>(pathname, `${path}/save`)
    if (matchSave) {
      yield put(_clearReload())
      return
    }

    /**  /sakura/:key  */
    const matchView = match<{ key: string }>(pathname, `${path}/:key`)
    if (matchView) {
      const value = matchView.params.key
      yield put(_updateReload(`view${model}`, {search, value}))
      yield invokeReload()
      return
    }

    /**  /sakura/:key/:pkey(/other)*  */
    type Created = { key: string, pkey: string }
    const matchViewList = match<Created>(pathname, `${path}/:key/:pkey/:other*`)
    if (matchViewList) {
      const pkey = matchViewList.params.pkey
      const value = matchViewList.params.key
      yield put(_updateReload(`view(${pkey})${model}`, {search, value}))
      yield invokeReload()
      return
    }

  } else {

    yield put(_clearReload())
  }
}

function findPageInfo(state: RootState, pathname: string) {
  for (const pageInfo of pageInfos) {
    if (pathname.startsWith(pageInfo.matchPath)) {
      return pageInfo
    }
  }
  return null
}

function* invokeReload() {
  const reload = yield select((state: RootState) => state.current.reload)
  if (reload) {
    yield put({type: `${reload.action}Request`, ...reload.param})
  }
}

export const currentSaga = {updateReload, invokeReload}

function _updateReload(action: string, param?: {}) {
  return {type: 'updateReload', reload: {loading: false, action, param}}
}

function _clearReload() {
  return {type: 'updateReload'}
}
