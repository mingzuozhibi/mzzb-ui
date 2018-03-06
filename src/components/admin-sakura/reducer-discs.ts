import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { message, Modal } from 'antd'
import { BaseModel, Manager } from '../../utils/manager'
import { AdminSakuraState, pageInfo, SakuraModel } from './reducer'
import request from '../../utils/request'

export interface DiscModel extends BaseModel {
  asin: number
  title: string
  titlePc?: string
  titleMo?: string
  surplusDays: number
}

export interface SakuraOfDiscsModel extends SakuraModel {
  discs: DiscModel[]
}

export interface DiscsState {
  searchOfDiscs?: DiscModel[]
  detailOfDiscs?: SakuraOfDiscsModel
}

export function discsReducer(action: AnyAction, draftState: AdminSakuraState) {
  const model = draftState.detailOfDiscs!
  const search = draftState.searchOfDiscs || []
  switch (action.type) {
    case `view(discs)${pageInfo.pageModel}Succeed`:
      draftState.detailOfDiscs = action.data
      draftState.message = undefined
      break
    case `view(discs)${pageInfo.pageModel}Failed`:
      draftState.message = action.message
      break
    case `push(discs)${pageInfo.pageModel}Succeed`:
      message.success(`添加碟片成功`)
      model.discs.unshift(action.data)
      draftState.searchOfDiscs = search.filter(d => d.id !== action.data.id)
      break
    case `push(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `添加碟片失败`, content: action.message})
      break
    case `drop(discs)${pageInfo.pageModel}Succeed`:
      message.success(`移除碟片成功`)
      model.discs = model.discs.filter(d => d.id !== action.data.id)
      draftState.searchOfDiscs = [action.data, ...search]
      break
    case `drop(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `移除碟片失败`, content: action.message})
      break
    case `search(discs)${pageInfo.pageModel}Succeed`:
      message.success(`查找碟片成功`)
      draftState.searchOfDiscs = [...action.data, ...search]
      break
    case `search(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `查找碟片失败`, content: action.message})
      break
    default:
  }
}

const manager = new Manager<SakuraModel>('/api/sakuras')
const query = 'discColumns=id,asin,surplusDays,title,titlePc,titleMo'

function* viewDiscs(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'discs', query)
  if (result.success) {
    yield put({type: `view(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `view(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* pushDiscs(action: AnyAction) {
  const result = yield call(manager.pushList, action.id, 'discs', action.pid, query)
  if (result.success) {
    yield put({type: `push(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `push(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* dropDiscs(action: AnyAction) {
  const result = yield call(manager.dropList, action.id, 'discs', action.pid, query)
  if (result.success) {
    yield put({type: `drop(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `drop(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* searchDisc(action: AnyAction) {
  const result = yield call(request, `/api/discs/search/${action.asin}`)
  if (result.success) {
    yield put({type: `search(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `search(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const discsSaga = {
  viewDiscs, pushDiscs, dropDiscs, searchDisc
}
