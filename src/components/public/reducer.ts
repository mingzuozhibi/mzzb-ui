import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

export const MODEL_NAME = 'Public'

export interface DiscModel extends BaseModel {
  thisRank: number
  prevRank: number
  totalPt: number
  title: string
}

export interface SakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  modifyTime: number
  discs: DiscModel[]
}

export interface PublicState extends BaseState<SakuraModel> {
}

const initState: PublicState = {}

export const publicReducer = (state: PublicState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${MODEL_NAME}Succeed`:
        draftState.models = action.models
        draftState.message = undefined
        break
      case `list${MODEL_NAME}Failed`:
        draftState.message = action.message
        break
      case `view${MODEL_NAME}Succeed`:
        draftState.detail = action.detail
        draftState.message = undefined
        break
      case `view${MODEL_NAME}Failed`:
        draftState.message = action.message
        break
      default:
    }
  })
}

const manager = new Manager<SakuraModel>('/api/sakuras')
const columns = 'discColumns=id,thisRank,prevRank,totalPt,title&viewType=PublicList'

function* listModel() {
  const result = yield call(manager.findAll, columns)
  if (result.success) {
    yield put({type: `list${MODEL_NAME}Succeed`, models: result.data})
  } else {
    yield put({type: `list${MODEL_NAME}Failed`, message: result.message})
  }
}

function* searchModel(action: AnyAction) {
  if (action.search === 'id') {
    return yield call(manager.getOne, parseInt(action.value, 10), columns)
  } else {
    return yield call(manager.search, action.search, action.value, columns)
  }
}

function* viewModel(action: AnyAction) {
  const result = yield searchModel(action)
  if (result.success) {
    yield put({type: `view${MODEL_NAME}Succeed`, detail: result.data})
  } else {
    yield put({type: `view${MODEL_NAME}Failed`, message: result.message})
  }
}

export const publicSaga = {listModel, viewModel}
