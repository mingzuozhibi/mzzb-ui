import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: 'TOP100',
  matchPath: '/topdisc',
  pageModel: 'TopDisc',
  modelName: 'DVD碟片',
  searchFor: 'page',
  component: () => import('.')
}

export interface TopDiscModel extends BaseModel {
  asin: string
  rank: number
  title: string
  isAnime: boolean
}

export interface PageData {
  page: number
  size: number
  maxPage: number
  maxSize: number
}

export interface TopDiscState extends BaseState<TopDiscModel> {
}

const initState: TopDiscState = {
  pageInfo
}

export const topdiscReducer = (state: TopDiscState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${pageInfo.pageModel}Succeed`:
        draftState.models = action.topdiscs
        draftState.message = undefined
        break
      case `list${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      default:
    }
  })
}

const manager = new Manager<TopDiscModel>('/proxy/topDiscs')

function* listModel(action: AnyAction) {
  const result = yield call(manager.findAll, action.query)
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, topdiscs: result.content})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const topdiscSaga = {listModel}
