import { AnyAction } from 'redux'
import { put, select } from 'redux-saga/effects'
import { RootState } from '../root-reducer'
import { pageInfos } from '../route-infos'
import { matchPath } from 'react-router-dom'
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
    const path = pageInfo.matchPath
    const model = pageInfo.pageModel
    const search = pageInfo.searchFor

    /**  /list  */
    const matchFindAll = match(pathname, path)
    if (matchFindAll) {
      yield put(_updateReload(_reload(`findAll${model}`)))
      yield invokeReload()
      return
    }

    /**  /list/edit  */
    const matchEditAll = match(pathname, `${path}/edit`)
    if (matchEditAll) {
      yield put(_updateReload(_reload(`editAll${model}`)))
      yield invokeReload()
      return
    }

    /**  /list/save  */
    const matchSaveAll = match(pathname, `${path}/save`)
    if (matchSaveAll) {
      yield put(_updateReload())
      return
    }

    /**  /list/:key  */
    const matchFindOne = match<{ value: string }>(pathname, `${path}/:value`)
    if (matchFindOne) {
      const value = matchFindOne.params.value
      yield put(_updateReload(_reload(`findOne${model}`, {search, value})))
      yield invokeReload()
      return
    }

    /**  /list/:key/edit  */
    const matchEditOne = match<{ value: string }>(pathname, `${path}/:value/edit`)
    if (matchEditOne) {
      const value = matchEditOne.params.value
      yield put(_updateReload(_reload(`editOne${model}`, {search, value})))
      yield invokeReload()
      return
    }

    /**  /list/:key/discs  */
    const matchFindList = match<{ value: string, pkey: string }>(pathname, `${path}/:value/:pkey`)
    if (matchFindList) {
      const value = matchFindList.params.value
      const pkey = matchFindList.params.pkey
      yield put(_updateReload(_reload(`find(${pkey})${model}`, {search, value})))
      yield invokeReload()
      return
    }

    /**  /list/:key/discs/edit  */
    const matchEditList = match<{ value: string, pkey: string }>(pathname, `${path}/:value/:pkey/edit`)
    if (matchEditList) {
      const value = matchEditList.params.value
      const pkey = matchEditList.params.pkey
      yield put(_updateReload(_reload(`edit(${pkey})${model}`, {search, value})))
      yield invokeReload()
      return
    }

    yield put(_updateReload())
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

function _reload(action: string, param?: {}) {
  return {loading: false, action, param}
}

function _updateReload(reload?: Reload) {
  return {type: 'updateReload', reload}
}
