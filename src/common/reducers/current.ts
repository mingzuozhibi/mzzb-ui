import { AnyAction } from 'redux'
import { put, select } from 'redux-saga/effects'
import { RootState } from '../root-reducer'
import { pageInfos } from '../menu-infos'
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

function* updateReload({payload}: any) {
  const pathname: string = payload.pathname
  const state = yield select()
  const pageInfo = findPageInfo(state, pathname)

  if (pageInfo) {
    if (pageInfo.matchPath !== pathname) {
      const action = `view${pageInfo.pageModel}`
      const search = pageInfo.searchFor

      const split = pathname.substring(pageInfo.matchPath.length + 1).split('/')
      switch (split[0]) {
        case 'save':
          /**  /admin/sakura/save       */
          yield put(_updateReload())
          break
        case 'edit':
          /**  /admin/sakura/edit/:key  */
          yield put(_updateReload(_reload(action, {search, value: split[1]})))
          break
        default:
          /**  /admin/sakura/:key       */
          yield put(_updateReload(_reload(action, {search, value: split[0]})))
          break
      }
    } else {
      yield put(_updateReload(_reload(`list${pageInfo.pageModel}`)))
    }
    yield invokeReload()
  } else {
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
