import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'
import { message, Modal } from 'antd'

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
  totalPt: number
  nicoBook: number
  thisRank: number
  prevRank: number
  discType: string
  updateType: string
  releaseDate: string
}

export interface DiscState extends BaseState<DiscModel> {
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
  })
}

const manager = new Manager<DiscModel>('/api/discs')

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

export const discSaga = {viewModel, editModel}