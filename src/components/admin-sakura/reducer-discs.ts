import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { message, Modal } from 'antd'
import { BaseModel, Manager } from '../../utils/manager'
import { AdminSakuraState, pageInfo, SakuraModel } from './reducer'
import request from '../../utils/request'

export interface DiscModel extends BaseModel {
  asin: string
  title: string
  titlePc?: string
  titleMo?: string
  surplusDays: number
}

export interface SakuraOfDiscsModel extends SakuraModel {
  discs: DiscModel[]
}

export interface DiscsState {
  addDiscs: DiscModel[]
  detailOfDiscs?: SakuraOfDiscsModel
}

export function discsReducer(action: AnyAction, draftState: AdminSakuraState) {
  const detail = draftState.detailOfDiscs!
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
      detail.discs.unshift(action.data)
      deleteIf(draftState.addDiscs, t => t.id === action.data.id)
      break
    case `push(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `添加碟片失败`, content: action.message})
      break
    case `drop(discs)${pageInfo.pageModel}Succeed`:
      message.success(`移除碟片成功`)
      deleteIf(detail.discs, t => t.id === action.data.id)
      draftState.addDiscs.push(action.data)
      break
    case `drop(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `移除碟片失败`, content: action.message})
      break
    case `search(discs)${pageInfo.pageModel}Succeed`:
      message.success(`查找碟片成功`)
      draftState.addDiscs.unshift(...action.data)
      break
    case `search(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `查找碟片失败`, content: action.message})
      break
    default:
  }
}

function deleteIf<T>(array: Array<T>, fun: (t: T) => boolean) {
  let index = 0
  while (index < array.length) {
    array[index] && fun(array[index]) && array.splice(index, 1)
    index++
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
