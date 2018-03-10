import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'
import { message, Modal } from 'antd'
import { recordsReducer, recordsSaga } from './reducer-records'

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
      default:
    }

    recordsReducer(action, draftState)
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

export const discSaga = {viewModel, editModel, ...recordsSaga}
