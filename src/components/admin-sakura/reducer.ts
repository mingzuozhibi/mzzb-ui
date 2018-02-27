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

export interface AdminSakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
}

export interface AdminSakuraState extends BaseState<AdminSakuraModel> {
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
      case `edit${pageInfo.modelName}Failed`:
        Modal.error({title: `编辑${pageInfo.modelName}失败`, content: action.message})
        break
      default:
    }
  })
}

const manager = new Manager<AdminSakuraModel>('/api/basic/sakuras')

function* listModel() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, models: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* searchModel(action: AnyAction) {
  if (action.search === 'id') {
    return yield call(manager.getOne, parseInt(action.value, 10))
  } else {
    return yield call(manager.search, action.search, action.value)
  }
}

function* viewModel(action: AnyAction) {
  const result = yield searchModel(action)
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}Failed`, message: result.message})
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
  const result = yield call(manager.update, action.model)
  if (result.success) {
    yield put({type: `edit${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `edit${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const adminSakuraSaga = {listModel, viewModel, saveModel, editModel}
