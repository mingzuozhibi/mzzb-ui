import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import { message, Modal } from 'antd'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '管理用户',
  matchPath: '/user',
  pageModel: 'User',
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

export interface UserState extends BaseState<UserModel> {
  editAll?: UserModel[]
  editOne?: UserModel
}

const initState: UserState = {
  pageInfo
}

export const userReducer = (state: UserState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `editAll${pageInfo.pageModel}Succeed`:
        draftState.editAll = action.data
        draftState.message = undefined
        break
      case `editAll${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `editOne${pageInfo.pageModel}Succeed`:
        draftState.editOne = action.data
        draftState.message = undefined
        break
      case `editOne${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      /**  以上为查询方法  */
      case `addOne${pageInfo.pageModel}Succeed`:
        message.success(`添加${pageInfo.modelName}成功`)
        break
      case `addOne${pageInfo.pageModel}Failed`:
        Modal.error({title: `添加${pageInfo.modelName}失败`, content: action.message})
        break
      case `setOne${pageInfo.pageModel}Succeed`:
        message.success(`编辑${pageInfo.modelName}成功`)
        draftState.editOne = action.data
        break
      case `setOne${pageInfo.pageModel}Failed`:
        Modal.error({title: `编辑${pageInfo.modelName}失败`, content: action.message})
        break
      default:
    }
  })
}

const manager = new Manager<UserModel>('/api/users')

function* editAll() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `editAll${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `editAll${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* editOne(action: AnyAction) {
  const result = yield call(manager.findOne, action.search, action.value)
  if (result.success) {
    yield put({type: `editOne${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `editOne${pageInfo.pageModel}Failed`, message: result.message})
  }
}

/**  以上为查询方法  */

function* addOne(action: AnyAction) {
  const result = yield call(manager.addOne, action.model)
  if (result.success) {
    yield put({type: `addOne${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `addOne${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* setOne(action: AnyAction) {
  const result = yield call(manager.setOne, action.id, action.model)
  if (result.success) {
    yield put({type: `setOne${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `setOne${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const adminUserSaga = {editAll, editOne, addOne, setOne}
