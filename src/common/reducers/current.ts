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
  window.scroll(0, 0)
  const pathname: string = payload.location.pathname
  const pageInfo = findPageInfo(pathname)

  if (pageInfo) {
    const primary = pageInfo.searchFor
    const model = pageInfo.pageModel
    const path = pageInfo.matchPath

    /**  /sakura  */
    const matchList = match(pathname, path)
    if (matchList) {
      yield put(_updateReload(`list${model}`, {query: payload.search}))
      yield invokeReload()
      return
    }

    /**  /sakura/save  */
    const matchSave = match(pathname, `${path}/save`)
    if (matchSave) {
      yield put(_clearReload())
      return
    }

    /**  /disc/find/asin/xxxx  */
    const matchFind = match<{ key: string, value: string}>(pathname, `${path}/find/:key/:value`)
    if (matchFind) {
      const key = matchFind.params.key
      const value = matchFind.params.value
      yield put(_updateReload(`view${model}`, {key, value}))
      yield invokeReload()
      return
    }

    /**  /sakura/xxxx  */
    const matchView = match<{ value: string }>(pathname, `${path}/:value`)
    if (matchView) {
      const value = matchView.params.value
      yield put(_updateReload(`view${model}`, {key: primary, value}))
      yield invokeReload()
      return
    }

    /**  /sakura/xxxx/discs  */
    type Created = { value: string, field: string }
    const matchViewList = match<Created>(pathname, `${path}/:value/:field`)
    if (matchViewList) {
      const field = matchViewList.params.field
      const value = matchViewList.params.value
      yield put(_updateReload(`view(${field})${model}`, {key: primary, value}))
      yield invokeReload()
      return
    }

  } else {

    yield put(_clearReload())
  }
}

function findPageInfo(pathname: string) {
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
