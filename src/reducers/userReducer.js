import {call, put} from 'redux-saga/effects'
import produce from 'immer'
import {alertError, showSuccess} from '../utils/window'
import userManager from '../services/userManager'

const USER_LIST_REQUESTED = 'USER_LIST_REQUESTED'
const USER_LIST_SUCCEEDED = 'USER_LIST_SUCCEEDED'
const USER_LIST_FAILED = 'USER_LIST_FAILED'

const USER_SAVE_REQUESTED = 'USER_SAVE_REQUESTED'
const USER_SAVE_SUCCEEDED = 'USER_SAVE_SUCCEEDED'
const USER_SAVE_FAILED = 'USER_SAVE_FAILED'

const USER_EDIT_REQUESTED = 'USER_EDIT_REQUESTED'
const USER_EDIT_SUCCEEDED = 'USER_EDIT_SUCCEEDED'
const USER_EDIT_FAILED = 'USER_EDIT_FAILED'


const initState = {
  pending: false
}

export default function (state = initState, action) {
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
      case USER_SAVE_SUCCEEDED:
        draft.users.push(action.user)
        showSuccess('用户添加成功')
        break
      case USER_SAVE_FAILED:
        alertError(`用户添加失败: ${action.message}`)
        break
      case USER_EDIT_SUCCEEDED:
        draft.users = state.users
          .map(u => u.id === action.user.id ? action.user : u)
        showSuccess('用户修改成功')
        break
      case USER_EDIT_FAILED:
        alertError(`用户修改失败: ${action.message}`)
        break
      default:
    }
  })
}


function* fetchListUser() {
  try {
    const data = yield call(userManager.listUser)
    if (data.success) {
      yield put({type: USER_LIST_SUCCEEDED, users: data.data})
    } else {
      yield put({type: USER_LIST_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: USER_LIST_FAILED, message: err.message})
  }
}

function* fetchSaveUser(action) {
  try {
    const data = yield call(userManager.saveUser, action.username, action.password)
    if (data.success) {
      yield put({type: USER_SAVE_SUCCEEDED, user: data.data})
    } else {
      yield put({type: USER_SAVE_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: USER_SAVE_FAILED, message: err.message})
  }
}

function* fetchEditUser(action) {
  try {
    const data = yield call(userManager.editUser, action.user)
    if (data.success) {
      yield put({type: USER_EDIT_SUCCEEDED, user: data.data})
    } else {
      yield put({type: USER_EDIT_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: USER_EDIT_FAILED, message: err.message})
  }
}

export function requestListUser() {
  return {type: USER_LIST_REQUESTED}
}

export function requestSaveUser(username, password) {
  return {type: USER_SAVE_REQUESTED, username, password}
}

export function requestEditUser(user) {
  return {type: USER_EDIT_REQUESTED, user}
}

export const userSagas = [
  [USER_LIST_REQUESTED, fetchListUser],
  [USER_SAVE_REQUESTED, fetchSaveUser],
  [USER_EDIT_REQUESTED, fetchEditUser],
]
