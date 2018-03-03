import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { message, Modal } from 'antd'
import { BaseModel, Manager } from '../../utils/manager'
import { AdminSakuraState, pageInfo, SakuraModel } from './reducer'

export interface DiscModel extends BaseModel {
  asin: number
  title: string
  thisRank: number
  surplusDays: number
}

export interface SakuraOfDiscsModel extends SakuraModel {
  discs: DiscModel[]
}

export interface DiscsState {
  detailOfDiscs?: SakuraOfDiscsModel
}

export function discsReducer(action: AnyAction, draftState: AdminSakuraState) {
  switch (action.type) {
    case `view(discs)${pageInfo.pageModel}Succeed`:
      draftState.detailOfDiscs = action.detail
      draftState.message = undefined
      break
    case `view(discs)${pageInfo.pageModel}Failed`:
      draftState.message = action.message
      break
    case `push(discs)${pageInfo.pageModel}Succeed`:
      message.success(`添加碟片成功`)
      draftState.detailOfDiscs!.discs.unshift(action.disc)
      break
    case `push(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `添加碟片失败`, content: action.message})
      break
    case `drop(discs)${pageInfo.pageModel}Succeed`:
      message.success(`移除碟片成功`)
      const model = draftState.detailOfDiscs!
      model.discs = model.discs.filter(d => d.id !== action.disc.id)
      break
    case `drop(discs)${pageInfo.pageModel}Failed`:
      Modal.error({title: `移除碟片失败`, content: action.message})
      break
    default:
  }
}

const manager = new Manager<SakuraModel>('/api/sakuras')
const query = 'discColumns=id,asin,thisRank,surplusDays,title'

function* viewDiscs(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'discs', query)
  if (result.success) {
    yield put({type: `view(discs)${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `view(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* pushDiscs(action: AnyAction) {
  const result = yield call(manager.pushList, action.id, 'discs', action.pid, query)
  if (result.success) {
    yield put({type: `push(discs)${pageInfo.pageModel}Succeed`, disc: result.data})
  } else {
    yield put({type: `push(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* dropDiscs(action: AnyAction) {
  const result = yield call(manager.dropList, action.id, 'discs', action.pid, query)
  if (result.success) {
    yield put({type: `drop(discs)${pageInfo.pageModel}Succeed`, disc: result.data})
  } else {
    yield put({type: `drop(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const discsSaga = {
  viewDiscs, pushDiscs, dropDiscs
}
