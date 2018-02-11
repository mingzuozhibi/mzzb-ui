import {put} from 'redux-saga/effects'
import produce from 'immer'
import {showSuccess} from '../utils/window'
import userManager from '../services/userManager'

const USERS_FETCH_REQUESTED = 'USERS_FETCH_REQUESTED'
const USERS_FETCH_SUCCEEDED = 'USERS_FETCH_SUCCEEDED'
const USERS_FETCH_FAILED = 'USERS_FETCH_FAILED'

const initState = {
  pending: false
}

export default function sakuraReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case USERS_FETCH_REQUESTED:
        draft.pending = true
        draft.message = undefined
        break
      case USERS_FETCH_SUCCEEDED:
        draft.pending = false
        draft.users = action.users
        showSuccess('users数据更新成功')
        break
      case USERS_FETCH_FAILED:
        draft.pending = false
        draft.message = action.message
        break
      default:
    }
  })
}

export function requestUsers() {
  return {type: USERS_FETCH_REQUESTED}
}

export function* fetchUsers() {
  try {
    const data = yield userManager.findAll()
    if (data.success) {
      yield put({type: USERS_FETCH_SUCCEEDED, users: data.data})
    } else {
      yield put({type: USERS_FETCH_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: USERS_FETCH_FAILED, message: err.message})
  }
}
