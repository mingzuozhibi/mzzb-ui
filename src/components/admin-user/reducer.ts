import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { PageInfo } from '../../common/route-infos'
import { BaseState } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '用户管理',
  matchPath: '/admin/user',
  pageModel: 'AdminUser',
  modelName: '用户',
  searchFor: 'id',
  component: () => import('.')
}

export interface UserModel extends BaseModel {
  username: string
  enabled: boolean
  registerDate: string
  lastLoggedIn: string
}

export interface AdminUserState extends BaseState<UserModel> {
}

const initState: AdminUserState = {
  pageInfo
}

export const adminUserReducer = (state: AdminUserState = initState, action: AnyAction) => {
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
        draftState.models!.push(action.data)
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
      default:
    }
  })
}

const manager = new Manager<UserModel>('/api/users')

function* listModel() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewModel(action: AnyAction) {
  const result = yield yield call(manager.findOne, action.key, action.value)
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

export const adminUserSaga = {listModel, viewModel, saveModel, editModel}
