import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '公开列表',
  matchPath: '/public',
  pageModel: 'Public',
  modelName: '列表',
  searchFor: 'key',
  component: () => import('.')
}

export interface DiscModel extends BaseModel {
  thisRank: number
  prevRank: number
  totalPt: number
  title: string
}

export interface SakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  modifyTime: number
  discs: DiscModel[]
}

export interface PublicState extends BaseState<SakuraModel> {
}

const initState: PublicState = {
  pageInfo
}

export const publicReducer = (state: PublicState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${pageInfo.pageModel}Succeed`:
        draftState.models = action.models
        draftState.message = undefined
        break
      case `list${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `view${pageInfo.pageModel}Succeed`:
        draftState.detail = action.detail
        draftState.message = undefined
        break
      case `view${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      default:
    }
  })
}

const manager = new Manager<SakuraModel>('/api/sakuras')

function* listModel() {
  const result = yield call(manager.findAll, 'hasDiscs=false&viewType=PublicList')
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, models: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* searchModel(action: AnyAction) {
  if (action.search === 'id') {
    return yield call(manager.getOne, parseInt(action.value, 10))
  } else {
    return yield call(manager.findOne, action.search, action.value)
  }
}

function* viewModel(action: AnyAction) {
  const result = yield searchModel(action)
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const publicSaga = {listModel, viewModel}
