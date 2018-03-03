import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { message, Modal } from 'antd'
import { BaseModel, Manager } from '../../utils/manager'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { discsReducer, discsSaga, DiscsState } from './reducer-discs'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '列表管理',
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

export interface AdminSakuraState extends BaseState<SakuraModel>, DiscsState {
}

const initState: AdminSakuraState = {
  pageInfo
}

export const adminSakuraReducer = (state: AdminSakuraState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${pageInfo.pageModel}Succeed`:
        draftState.models = action.data
        draftState.message = undefined
        break
      case `list${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `view${pageInfo.pageModel}Succeed`:
        draftState.detail = action.data
        draftState.message = undefined
        break
      case `view${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `save${pageInfo.pageModel}Succeed`:
        message.success(`创建${pageInfo.modelName}成功`)
        break
      case `save${pageInfo.pageModel}Failed`:
        Modal.error({title: `创建${pageInfo.modelName}失败`, content: action.message})
        break
      case `edit${pageInfo.pageModel}Succeed`:
        message.success(`编辑${pageInfo.modelName}成功`)
        draftState.detail = action.data
        break
      case `edit${pageInfo.pageModel}Failed`:
        Modal.error({title: `编辑${pageInfo.modelName}失败`, content: action.message})
        break
      case `drop${pageInfo.pageModel}Succeed`:
        message.success(`删除${pageInfo.modelName}成功`)
        draftState.detail = {...action.data, drop: true}
        break
      case `drop${pageInfo.pageModel}Failed`:
        Modal.error({title: `删除${pageInfo.modelName}失败`, content: action.message})
        break
      default:
    }

    discsReducer(action, draftState)
  })
}

const manager = new Manager<SakuraModel>('/api/sakuras')

function* listModel() {
  const result = yield call(manager.findAll, 'public=false')
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewModel(action: AnyAction) {
  const result = yield yield call(manager.findOne, action.search, action.value)
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* saveModel(action: AnyAction) {
  const result = yield call(manager.addOne, action.model)
  if (result.success) {
    yield put({type: `save${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `save${pageInfo.pageModel}Failed`, message: result.message})
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

function* dropModel(action: AnyAction) {
  const result = yield call(manager.delOne, action.id)
  if (result.success) {
    yield put({type: `drop${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `drop${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const adminSakuraSaga = {
  listModel, viewModel, saveModel, editModel, dropModel, ...discsSaga
}
