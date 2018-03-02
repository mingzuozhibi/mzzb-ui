import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './list.css'

import { compareFactory } from '../../utils/compare'

import { EditDiscModel, EditListModel, FindDiscModel, FindListModel, ListState, viewTypes } from './reducer'
import { ListFindAll } from './list-find-all'
import { ListEditAll } from './list-edit-all'
import { ListSave } from './list-save'
import { ListEditOne } from './list-edit-one'
import { ListFindDiscs } from './list-find-discs'
import { ListEditDiscs } from './list-edit-discs'

import produce from 'immer'

const compareFindDisc = compareFactory({
  apply: (disc: FindDiscModel) => disc.thisRank,
  check: (rank: number) => rank === undefined,
  compare: (a: number, b: number) => a - b
})

const compareBySurplusDays = compareFactory({
  apply: (disc: EditDiscModel) => disc.surplusDays,
  check: (sday: number) => sday === undefined,
  compare: (a: number, b: number) => a - b
})

const compareByTitle = compareFactory({
  apply: (disc: EditDiscModel) => disc.title,
  check: (title: string) => title === undefined,
  compare: (a: string, b: string) => a.localeCompare(b)
})

const compareEditDisc = (a: EditDiscModel, b: EditDiscModel) => {
  const bySurplusDays = compareBySurplusDays(a, b)
  if (bySurplusDays !== 0) {
    return bySurplusDays
  }
  return compareByTitle(a, b)
}

type CompareList = { viewType: string, key: string }
const compareList = (a: CompareList, b: CompareList) => {
  if (a.viewType !== b.viewType) {
    const indexA = viewTypes.findIndex(viewType => viewType.value === a.viewType)
    const indexB = viewTypes.findIndex(viewType => viewType.value === b.viewType)
    return indexA - indexB
  }
  return b.key.localeCompare(a.key)
}

export type OwnProps = RouteComponentProps<{}>

export interface ListProps extends ListState, OwnProps {
  saveModel: (model: {}) => void
  editModel: (id: number, model: {}) => void
  pushDisc: (id: number, pid: number) => void
  dropDisc: (id: number, pid: number) => void
}

export function List(props: ListProps) {

  function withFindAll(render: (models: FindListModel[]) => React.ReactNode) {
    if (props.findAll) {
      const newFindAll = produce(props.findAll, draft => {
        draft.sort(compareList)
      })
      return render(newFindAll)
    }
    return null
  }

  function withEditAll(render: (models: EditListModel[]) => React.ReactNode) {
    if (props.editAll) {
      const newEditAll = produce(props.editAll, draft => {
        draft.sort(compareList)
      })
      return render(newEditAll)
    }
    return null
  }

  function withEditOne(key: string, render: (detail: EditListModel) => React.ReactNode) {
    if (props.editOne && props.editOne.key === key) {
      return render(props.editOne)
    }
    return null
  }

  function withFindDiscs(key: string, render: (detail: FindListModel) => React.ReactNode) {
    if (props.findList && props.findList.key === key) {
      const newDetail = produce(props.findList, draft => {
        draft.discs.sort(compareFindDisc)
      })
      return render(newDetail)
    }
    return null
  }

  function withEditDiscs(key: string, render: (detail: EditListModel) => React.ReactNode) {
    if (props.editList && props.editList.key === key) {
      const newDetail = produce(props.editList, draft => {
        draft.discs.sort(compareEditDisc)
      })
      return render(newDetail)
    }
    return null
  }

  // console.info(`sakura render ${props.models !== undefined} ${new Date()}`)

  return (
    <div className="list-root">
      {props.message && (
        <Alert message={props.message} type="error"/>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withFindAll(models => (
            <div className="list-find-all">
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ListFindAll
                models={models}
                findDiscsTo={t => `${props.match.url}/${t.key}/discs`}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/edit`}
          exact={true}
          render={() => withEditAll(models => (
            <div className="list-edit-all">
              <Helmet>
                <title>管理{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  管理{props.pageInfo.modelName}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/save`}>添加{props.pageInfo.modelName}</Link>
                </Breadcrumb.Item>
              </Breadcrumb>
              <ListEditAll
                models={models}
                editOneTo={t => `${props.match.url}/${t.key}/edit`}
                editDiscsTo={t => `${props.match.url}/${t.key}/discs/edit`}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/save`}
          exact={true}
          render={() => (
            <div className="list-save">
              <Helmet>
                <title>添加{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/edit`}>管理{props.pageInfo.modelName}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  添加{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ListSave
                pageInfo={props.pageInfo}
                saveModel={props.saveModel}
              />
            </div>
          )}
        />
        <Route
          path={`${props.match.url}/:key/edit`}
          exact={true}
          render={({match}) => withEditOne(match.params.key, detail => (
            <div className="list-edit-one">
              <Helmet>
                <title>编辑{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/edit`}>管理{props.pageInfo.modelName}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  编辑{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ListEditOne
                detail={detail}
                pageInfo={props.pageInfo}
                editModel={props.editModel}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:key/discs`}
          exact={true}
          render={({match}) => withFindDiscs(match.params.key, detail => (
            <div className="list-find-discs">
              <Helmet>
                <title>{detail.title} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {detail.title}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ListFindDiscs detail={detail}/>
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:key/discs/edit`}
          exact={true}
          render={({match}) => withEditDiscs(match.params.key, detail => (
            <div className="list-edit-discs">
              <Helmet>
                <title>{detail.title} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/edit`}>管理{props.pageInfo.modelName}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {detail.title}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ListEditDiscs
                detail={detail}
                pushDisc={props.pushDisc}
                dropDisc={props.dropDisc}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
