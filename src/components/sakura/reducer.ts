import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

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

export interface SakuraState extends BaseState<SakuraModel> {
}

const initState: SakuraState = {}

export const sakuraReducer = (state: SakuraState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case 'listSakuraSucceed':
        draftState.models = action.models
        draftState.errors = undefined
        break
      case 'listSakuraFailed':
        draftState.errors = action.errors
        break
      default:
    }
  })
}

const manager = new Manager<SakuraModel>('/api/sakuras')

function* listModel() {
  const result = yield call(manager.findAll, 'discColumns=id,thisRank,prevRank,totalPt,title')
  if (result.success) {
    yield put({type: 'listSakuraSucceed', models: result.data})
  } else {
    yield put({type: 'listSakuraFailed', errors: result.message})
  }
}

export const sakuraFetcher = {listModel}
