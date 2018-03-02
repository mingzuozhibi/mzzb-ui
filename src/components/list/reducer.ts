import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'
import { message, Modal } from 'antd'

export const pageInfo: PageInfo = {
  pageTitle: '推荐列表',
  matchPath: '/list',
  pageModel: 'List',
  modelName: '列表',
  searchFor: 'key',
  component: () => import('.')
}

export const viewTypes = [
  {label: '日亚实时', value: 'SakuraList'},
  {label: '公开列表', value: 'PublicList'},
  {label: '私有列表', value: 'PrivateList'},
]

export interface FindDiscModel extends BaseModel {
  title: string
  totalPt: number
  thisRank: number
  prevRank: number
}

export interface EditDiscModel extends BaseModel {
  asin: string
  title: string
  thisRank: number
  surplusDays: number
}

export interface FindListModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
  discs: FindDiscModel[]
}

export interface EditListModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
  discs: EditDiscModel[]
}

export interface ListState extends BaseState<FindListModel> {
  findAll?: FindListModel[]
  editAll?: EditListModel[]
  editOne?: EditListModel
  findList?: FindListModel
  editList?: EditListModel
}

const initState: ListState = {
  pageInfo
}

export const listReducer = (state: ListState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `findAll${pageInfo.pageModel}Succeed`:
        draftState.findAll = action.data
        draftState.message = undefined
        break
      case `findAll${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
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
      case `find(discs)${pageInfo.pageModel}Succeed`:
        draftState.findList = action.data
        draftState.message = undefined
        break
      case `find(discs)${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `edit(discs)${pageInfo.pageModel}Succeed`:
        draftState.editList = action.data
        draftState.message = undefined
        break
      case `edit(discs)${pageInfo.pageModel}Failed`:
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
      case `push(discs)${pageInfo.pageModel}Succeed`:
        message.success(`添加碟片成功`)
        draftState.editList!.discs.unshift(action.disc)
        break
      case `push(discs)${pageInfo.pageModel}Failed`:
        Modal.error({title: `添加碟片失败`, content: action.message})
        break
      case `drop(discs)${pageInfo.pageModel}Succeed`:
        message.success(`移除碟片成功`)
        const model = draftState.editList!
        model.discs = model.discs.filter(d => d.id !== action.disc.id)
        break
      case `drop(discs)${pageInfo.pageModel}Failed`:
        Modal.error({title: `移除碟片失败`, content: action.message})
        break
      default:
    }
  })
}

const manager = new Manager<FindListModel>('/api/lists')

function* findAll() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `findAll${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `findAll${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* editAll() {
  const result = yield call(manager.findAll, 'public=false')
  if (result.success) {
    yield put({type: `editAll${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `editAll${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* editOne(action: AnyAction) {
  const query = 'discColumns=id,asin,thisRank,surplusDays,title'
  const result = yield call(manager.findOne, action.search, action.value, query)
  if (result.success) {
    yield put({type: `editOne${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `editOne${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* findDiscs(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'discs')
  if (result.success) {
    yield put({type: `find(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `find(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* editDiscs(action: AnyAction) {
  const query = 'discColumns=id,asin,thisRank,surplusDays,title'
  const result = yield call(manager.findList, action.search, action.value, 'discs', query)
  if (result.success) {
    yield put({type: `edit(discs)${pageInfo.pageModel}Succeed`, data: result.data})
  } else {
    yield put({type: `edit(discs)${pageInfo.pageModel}Failed`, message: result.message})
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

function* pushDiscs(action: AnyAction) {
  const result = yield call(manager.listPush, action.id, 'discs', action.pid)
  if (result.success) {
    yield put({type: `push(discs)${pageInfo.pageModel}Succeed`, disc: result.data})
  } else {
    yield put({type: `push(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* dropDiscs(action: AnyAction) {
  const result = yield call(manager.listDrop, action.id, 'discs', action.pid)
  if (result.success) {
    yield put({type: `drop(discs)${pageInfo.pageModel}Succeed`, disc: result.data})
  } else {
    yield put({type: `drop(discs)${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const listSaga = {findAll, editAll, editOne, findDiscs, editDiscs, addOne, setOne, pushDiscs, dropDiscs}
