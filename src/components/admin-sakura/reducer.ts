import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'

export interface AdminSakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
}

export interface AdminSakuraState extends BaseState<AdminSakuraModel> {
}

const initState: AdminSakuraState = {}

function replace(action: AnyAction) {
  return (t: BaseModel) => t.id === action.model.id ? action.model : t
}

export const adminSakuraReducer = (state: AdminSakuraState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case 'listAdminSakuraSucceed':
        draftState.models = action.models
        draftState.errors = undefined
        break
      case 'listAdminSakuraFailed':
        draftState.errors = action.errors
        break
      case 'saveAdminSakuraSucceed':
        draftState.models!.push(action.model)
        message.success('添加Sakura成功')
        break
      case 'saveAdminSakuraFailed':
        Modal.error({title: '添加Sakura失败', content: action.errors})
        break
      case 'editAdminSakuraSucceed':
        message.success('编辑Sakura成功')
        draftState.models = draftState.models!.map(replace(action))
        break
      case 'editAdminSakuraFailed':
        Modal.error({title: '编辑Sakura失败', content: action.errors})
        break
      default:
    }
  })
}

const manager = new Manager<AdminSakuraModel>('/api/basic/sakuras')

function* listModel() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: 'listAdminSakuraSucceed', models: result.data})
  } else {
    yield put({type: 'listAdminSakuraFailed', errors: result.message})
  }
}

function* saveModel(action: AnyAction) {
  const result = yield call(manager.addOne, action.model)
  if (result.success) {
    yield put({type: 'saveAdminSakuraSucceed', model: result.data})
  } else {
    yield put({type: 'saveAdminSakuraFailed', errors: result.message})
  }
}

function* editModel(action: AnyAction) {
  const result = yield call(manager.update, action.model)
  if (result.success) {
    yield put({type: 'editAdminSakuraSucceed', model: result.data})
  } else {
    yield put({type: 'editAdminSakuraFailed', errors: result.message})
  }
}

export const adminSakuraFetcher = {listModel, saveModel, editModel}
