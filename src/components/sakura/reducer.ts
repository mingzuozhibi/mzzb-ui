import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '日亚实时',
  matchPath: '/sakura',
  pageModel: 'Sakura',
  modelName: '列表',
  searchFor: 'key',
  component: () => import('.')
}

export interface SakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
}

export interface DiscModel extends BaseModel {
  title: string
  totalPt: number
  thisRank: number
  prevRank: number
}

export interface SakuraOfDiscsModel extends SakuraModel {
  discs: DiscModel[]
}

export interface SakuraState extends BaseState<SakuraModel> {
  detailOfDiscs?: SakuraOfDiscsModel
}

const initState: SakuraState = {
  pageInfo
}

export const sakuraReducer = (state: SakuraState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${pageInfo.pageModel}Succeed`:
        draftState.models = action.data
        draftState.message = undefined
        break
      case `list${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `view(discs)${pageInfo.pageModel}Succeed`:
        draftState.detailOfDiscs = action.data
        draftState.message = undefined
        break
      case `view(discs)${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      default:
    }
  })
}

const manager = new Manager<SakuraModel>('/api/sakuras')

function* listModel() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewDiscs(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'discs')
  if (result.success) {
    yield put({type: `view(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `view(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const sakuraSaga = {listModel, viewDiscs}
