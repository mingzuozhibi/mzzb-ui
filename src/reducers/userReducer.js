import {put} from 'redux-saga/effects'
import produce from 'immer'
import {alertError, showSuccess} from '../utils/window'
import userManager from '../services/userManager'

const USER_LIST_REQUESTED = 'USER_LIST_REQUESTED'
const USER_LIST_SUCCEEDED = 'USER_LIST_SUCCEEDED'
const USER_LIST_FAILED = 'USER_LIST_FAILED'

const USER_ADD_REQUESTED = 'USER_ADD_REQUESTED'
const USER_ADD_SUCCEEDED = 'USER_ADD_SUCCEEDED'
const USER_ADD_FAILED = 'USER_ADD_FAILED'


const initState = {
  pending: false
}

export default function sakuraReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case USER_LIST_REQUESTED:
        draft.pending = true
        draft.message = undefined
        break
      case USER_LIST_SUCCEEDED:
        draft.pending = false
        draft.users = action.users
        showSuccess('users数据更新成功')
        break
      case USER_LIST_FAILED:
        draft.pending = false
        draft.message = action.message
        break
      case USER_ADD_SUCCEEDED:
        draft.users.push(action.user)
        showSuccess('用户添加成功')
        break
      case USER_ADD_FAILED:
        alertError(`用户添加失败:${action.message}`)
        break
      default:
    }
  })
}

export function requestListUser() {
  return {type: USER_LIST_REQUESTED}
}

export function* fetchListUser() {
  try {
    const data = yield userManager.findAll()
    if (data.success) {
      yield put({type: USER_LIST_SUCCEEDED, users: data.data})
    } else {
      yield put({type: USER_LIST_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: USER_LIST_FAILED, message: err.message})
  }
}

export function requestAddUser(username, password) {
  return {type: USER_ADD_REQUESTED, username, password}
}

export function* fetchAddUser(action) {
  try {
    const data = yield userManager.addUser(action.username, action.password)
    if (data.success) {
      yield put({type: USER_ADD_SUCCEEDED, user: data.data})
    } else {
      yield put({type: USER_ADD_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: USER_ADD_FAILED, message: err.message})
  }
}
