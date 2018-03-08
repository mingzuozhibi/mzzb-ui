import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'
import { message, Modal } from 'antd'
import request from '../../utils/request'

export const pageInfo: PageInfo = {
  pageTitle: '碟片信息',
  matchPath: '/disc',
  pageModel: 'Disc',
  modelName: '碟片',
  searchFor: 'id',
  component: () => import('.')
}

export interface DiscModel extends BaseModel {
  asin: string
  title: string
  titlePc?: string
  titleMo?: string
  todayPt?: number
  totalPt?: number
  guessPt?: number
  nicoBook?: number
  thisRank?: number
  prevRank?: number
  discType: string
  updateType: string
  createTime: number
  updateTime?: number
  modifyTime?: number
  releaseDate: string
  surplusDays: number
}

export interface RankModel {
  date: string
  hour: string
  rank: number
}

export interface DiscOfRanksModel extends DiscModel {
  ranks: RankModel[]
}

export interface RecordModel extends BaseModel {
  date: string
  todayPt?: number
  totalPt?: number
  averRank?: number
}

export interface DiscOfRecordsModel extends DiscModel {
  records: RecordModel[]
}

export interface DiscState extends BaseState<DiscOfRanksModel> {
  detailOfRecords?: DiscOfRecordsModel
}

const initState: DiscState = {
  pageInfo
}

export const discReducer = (state: DiscState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `view${pageInfo.pageModel}Succeed`:
        draftState.detail = action.data
        draftState.message = undefined
        break
      case `view${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `edit${pageInfo.pageModel}Succeed`:
        message.success(`编辑${pageInfo.modelName}成功`)
        draftState.detail = action.data
        break
      case `edit${pageInfo.pageModel}Failed`:
        Modal.error({title: `编辑${pageInfo.modelName}失败`, content: action.message})
        break
      case `view(records)${pageInfo.pageModel}Succeed`:
        draftState.detailOfRecords = action.data
        draftState.message = undefined
        break
      case `view(records)${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `push(records)${pageInfo.pageModel}Succeed`:
        message.success(`设置排名数据成功`)
        draftState.detail = action.data
        break
      case `push(records)${pageInfo.pageModel}Failed`:
        Modal.error({title: `设置排名数据失败`, content: action.message})
        break
      default:
    }
  })
}

const manager = new Manager<DiscOfRanksModel>('/api/discs')

function* viewModel(action: AnyAction) {
  const result = yield call(manager.findOne, action.search, action.value)
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* editModel(action: AnyAction) {
  const result = yield call(manager.setOne, action.id, action.model)
  if (result.success) {
    yield put({type: `edit${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `edit${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewRecords(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'records')
  if (result.success) {
    yield put({type: `view(records)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `view(records)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* pushRecords(action: AnyAction) {
  const param = {method: 'post', body: JSON.stringify(action.model)}
  const result = yield call(request, `/api/discs/${action.id}/records`, param)
  if (result.success) {
    yield put({type: `push(records)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `push(records)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const discSaga = {viewModel, viewRecords, editModel, pushRecords}
