import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'

export const MODEL_NAME = 'AdminUser'

export interface AdminUserModel extends BaseModel {
  username: string
  enabled: boolean
  registerDate: string
  lastLoggedIn: string
}

export interface AdminUserState extends BaseState<AdminUserModel> {
}

const initState: AdminUserState = {}

function replace(action: AnyAction) {
  return (t: BaseModel) => t.id === action.model.id ? action.model : t
}

export const adminUserReducer = (state: AdminUserState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${MODEL_NAME}Succeed`:
        draftState.models = action.models
        draftState.message = undefined
        break
      case `list${MODEL_NAME}Failed`:
        draftState.message = action.message
        break
      case `save${MODEL_NAME}Succeed`:
        draftState.models!.push(action.model)
        message.success('添加用户成功')
        break
      case `save${MODEL_NAME}Failed`:
        Modal.error({title: '添加用户失败', content: action.message})
        break
      case `edit${MODEL_NAME}Succeed`:
        message.success('编辑用户成功')
        draftState.models = draftState.models!.map(replace(action))
        break
      case `edit${MODEL_NAME}Failed`:
        Modal.error({title: '编辑用户失败', content: action.message})
        break
      default:
    }
  })
}

const manager = new Manager<AdminUserModel>('/api/admin/users')

function* listModel() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `list${MODEL_NAME}Succeed`, models: result.data})
  } else {
    yield put({type: `list${MODEL_NAME}Failed`, message: result.message})
  }
}

function* saveModel(action: AnyAction) {
  const result = yield call(manager.addOne, action.model)
  if (result.success) {
    yield put({type: `save${MODEL_NAME}Succeed`, model: result.data})
  } else {
    yield put({type: `save${MODEL_NAME}Failed`, message: result.message})
  }
}

function* editModel(action: AnyAction) {
  const result = yield call(manager.update, action.model)
  if (result.success) {
    yield put({type: `edit${MODEL_NAME}Succeed`, model: result.data})
  } else {
    yield put({type: `edit${MODEL_NAME}Failed`, message: result.message})
  }
}

export const adminUserSaga = {listModel, saveModel, editModel}
