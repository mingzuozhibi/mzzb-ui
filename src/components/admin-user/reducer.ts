import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'

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
      case 'listAdminUserSucceed':
        draftState.models = action.models
        draftState.errors = undefined
        break
      case 'listAdminUserFailed':
        draftState.errors = action.errors
        break
      case 'saveAdminUserSucceed':
        draftState.models!.push(action.model)
        message.success('添加用户成功')
        break
      case 'saveAdminUserFailed':
        Modal.error({title: '添加用户失败', content: action.errors})
        break
      case 'editAdminUserSucceed':
        message.success('编辑用户成功')
        draftState.models = draftState.models!.map(replace(action))
        break
      case 'editAdminUserFailed':
        Modal.error({title: '编辑用户失败', content: action.errors})
        break
      default:
    }
  })
}

const manager = new Manager<AdminUserModel>('/api/admin/users')

export function* listAdminUser() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: 'listAdminUserSucceed', models: result.data})
  } else {
    yield put({type: 'listAdminUserFailed', errors: result.message})
  }
}

export function* saveAdminUser(action: AnyAction) {
  const result = yield call(manager.addOne, action.user)
  if (result.success) {
    yield put({type: 'saveAdminUserSucceed', model: result.data})
  } else {
    yield put({type: 'saveAdminUserFailed', errors: result.message})
  }
}

export function* editAdminUser(action: AnyAction) {
  const result = yield call(manager.update, action.user)
  if (result.success) {
    yield put({type: 'editAdminUserSucceed', model: result.data})
  } else {
    yield put({type: 'editAdminUserFailed', errors: result.message})
  }
}
