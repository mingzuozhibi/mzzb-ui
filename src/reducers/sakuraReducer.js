import {call, put} from 'redux-saga/effects'
import sakuraManager from '../services/sakuraManager'
import produce from 'immer'
import {showSuccess} from '../utils/window'

const SAKURA_FETCH_REQUESTED = 'SAKURA_FETCH_REQUESTED'
const SAKURA_FETCH_SUCCEEDED = 'SAKURA_FETCH_SUCCEEDED'
const SAKURA_FETCH_FAILED = 'SAKURA_FETCH_FAILED'

const initState = {
  pending: false
}

export default function sakuraReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case SAKURA_FETCH_REQUESTED:
        draft.pending = true
        draft.message = undefined
        break
      case SAKURA_FETCH_SUCCEEDED:
        draft.pending = false
        draft.sakuras = action.sakuras
        showSuccess('sakura数据更新成功')
        break
      case SAKURA_FETCH_FAILED:
        draft.pending = false
        draft.message = action.message
        break
      default:
    }
  })
}

export function requestSakura(columns) {
  return {type: SAKURA_FETCH_REQUESTED, columns}
}

export function* fetchSakura(action) {
  try {
    const data = yield call(sakuraManager.sakuras, action.columns)
    if (data.success) {
      yield put({type: SAKURA_FETCH_SUCCEEDED, sakuras: data.data})
    } else {
      yield put({type: SAKURA_FETCH_FAILED, message: data.message})
    }
  } catch (err) {
    yield put({type: SAKURA_FETCH_FAILED, message: err.message})
  }
}
