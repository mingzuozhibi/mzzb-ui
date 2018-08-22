import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '上架追踪',
  matchPath: '/newdisc',
  pageModel: 'NewDisc',
  modelName: '新碟片',
  searchFor: 'page',
  component: () => import('.')
}

export interface NewDiscModel extends BaseModel {
  asin: string
  title: string
  followed: boolean
  createTime: number
}

export interface PageData {
  page: number
  size: number
  maxPage: number
  maxSize: number
}

export interface NewDiscState extends BaseState<NewDiscModel> {
  pageData: PageData
}

const initState: NewDiscState = {
  pageInfo, pageData: {page: 0, size: 0, maxPage: 0, maxSize: 0}
}

export const newdiscReducer = (state: NewDiscState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${pageInfo.pageModel}Succeed`:
        draftState.models = action.newdiscs
        draftState.pageData = action.pageData
        draftState.message = undefined
        break
      case `list${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      default:
    }
  })
}

const manager = new Manager<NewDiscModel>('/api/newdiscs')

function* listModel(action: AnyAction) {
  const result = yield call(manager.findAll, action.query)
  if (result.success) {
    const {newdiscs, pageInfo: pageData} = result.data
    yield put({type: `list${pageInfo.pageModel}Succeed`, newdiscs, pageData})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const newdiscSaga = {listModel}
