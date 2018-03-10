import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { message, Modal } from 'antd'
import { BaseModel, Manager } from '../../utils/manager'
import { DiscModel, DiscState, pageInfo } from './reducer'
import request from '../../utils/request'

export interface RecordModel extends BaseModel {
  date: string
  todayPt?: number
  totalPt?: number
  averRank?: number
}

export interface DiscOfRecordsModel extends DiscModel {
  records: RecordModel[]
}

export const recordsReducer = (action: AnyAction, draftState: DiscState) => {
  switch (action.type) {
    case `view(records)${pageInfo.pageModel}Succeed`:
      draftState.detailOfRecords = action.data
      draftState.message = undefined
      break
    case `view(records)${pageInfo.pageModel}Failed`:
      draftState.message = action.message
      break
    case `merge(ranks)${pageInfo.pageModel}Succeed`:
      message.success(`提交排名数据成功`)
      draftState.detailOfRecords = action.data
      break
    case `merge(ranks)${pageInfo.pageModel}Failed`:
      Modal.error({title: `提交排名数据失败`, content: action.message})
      break
    case `merge(pts)${pageInfo.pageModel}Succeed`:
      message.success(`提交PT数据成功`)
      draftState.detailOfRecords = action.data
      break
    case `merge(pts)${pageInfo.pageModel}Failed`:
      Modal.error({title: `提交PT数据失败`, content: action.message})
      break
    default:
  }
}

const manager = new Manager<DiscOfRecordsModel>('/api/discs')

function* viewRecords(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'records')
  if (result.success) {
    yield put({type: `view(records)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `view(records)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* mergeRanks(action: AnyAction) {
  const param = {method: 'put', body: JSON.stringify(action.model)}
  const result = yield call(request, `/api/discs/${action.id}/ranks`, param)
  if (result.success) {
    yield put({type: `merge(ranks)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `merge(ranks)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* mergePts(action: AnyAction) {
  const param = {method: 'put', body: JSON.stringify(action.model)}
  const result = yield call(request, `/api/discs/${action.id}/pts`, param)
  if (result.success) {
    yield put({type: `merge(pts)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `merge(pts)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const recordsSaga = {viewRecords, mergeRanks, mergePts}
