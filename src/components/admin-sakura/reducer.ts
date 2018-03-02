import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '管理列表',
  matchPath: '/admin/sakura',
  pageModel: 'AdminSakura',
  modelName: '列表',
  searchFor: 'key',
  component: () => import('.')
}

export const viewTypes = [
  {label: '日亚实时', value: 'SakuraList'},
  {label: '公开列表', value: 'PublicList'},
  {label: '私有列表', value: 'PrivateList'},
]

export interface SakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
}

export interface DiscModel extends BaseModel {
  asin: number
  title: string
  thisRank: number
  surplusDays: number
}

export interface SakuraOfDiscsModel extends SakuraModel {
  discs: DiscModel[]
}

export interface AdminSakuraState extends BaseState<SakuraModel> {
  detailOfDiscs?: SakuraOfDiscsModel
}

const initState: AdminSakuraState = {
  pageInfo
}

export const adminSakuraReducer = (state: AdminSakuraState = initState, action: AnyAction) => {
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
      case `view${pageInfo.pageModel}(discs)Succeed`:
        draftState.detailOfDiscs = action.detail
        draftState.message = undefined
        break
      case `view${pageInfo.pageModel}(discs)Failed`:
        draftState.message = action.message
        break
      case `save${pageInfo.pageModel}Succeed`:
        draftState.models!.push(action.detail)
        message.success(`添加${pageInfo.modelName}成功`)
        break
      case `save${pageInfo.pageModel}Failed`:
        Modal.error({title: `添加${pageInfo.modelName}失败`, content: action.message})
        break
      case `edit${pageInfo.pageModel}Succeed`:
        message.success(`编辑${pageInfo.modelName}成功`)
        draftState.detail = action.detail
        break
      case `edit${pageInfo.pageModel}Failed`:
        Modal.error({title: `编辑${pageInfo.modelName}失败`, content: action.message})
        break
      case `pushDisc${pageInfo.pageModel}Succeed`:
        message.success(`添加碟片成功`)
        draftState.detailOfDiscs!.discs.unshift(action.disc)
        break
      case `pushDisc${pageInfo.pageModel}Failed`:
        Modal.error({title: `添加碟片失败`, content: action.message})
        break
      case `dropDisc${pageInfo.pageModel}Succeed`:
        message.success(`移除碟片成功`)
        const model = draftState.detailOfDiscs!
        model.discs = model.discs.filter(d => d.id !== action.disc.id)
        break
      case `dropDisc${pageInfo.pageModel}Failed`:
        Modal.error({title: `移除碟片失败`, content: action.message})
        break
      default:
    }
  })
}

const manager = new Manager<SakuraModel>('/api/lists')

function* listModel() {
  const result = yield call(manager.findAll, 'public=false')
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, models: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewModel(action: AnyAction) {
  const result = yield yield call(manager.findOne, action.search, action.value)
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewOfDiscs(action: AnyAction) {
  const query = 'discColumns=id,asin,thisRank,surplusDays,title'
  const result = yield call(manager.findList, action.search, action.value, 'discs', query)
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}(discs)Succeed`, detail: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}(discs)Failed`, message: result.message})
  }
}

function* saveModel(action: AnyAction) {
  const result = yield call(manager.addOne, action.model)
  if (result.success) {
    yield put({type: `save${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `save${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* editModel(action: AnyAction) {
  const result = yield call(manager.setOne, action.id, action.model)
  if (result.success) {
    yield put({type: `edit${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `edit${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* pushDisc(action: AnyAction) {
  const result = yield call(manager.listPush, action.id, 'discs', action.pid)
  if (result.success) {
    yield put({type: `pushDisc${pageInfo.pageModel}Succeed`, disc: result.data})
  } else {
    yield put({type: `pushDisc${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* dropDisc(action: AnyAction) {
  const result = yield call(manager.listDrop, action.id, 'discs', action.pid)
  if (result.success) {
    yield put({type: `dropDisc${pageInfo.pageModel}Succeed`, disc: result.data})
  } else {
    yield put({type: `dropDisc${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const adminSakuraSaga = {
  listModel, viewModel, viewOfDiscs, saveModel, editModel, pushDisc, dropDisc
}
