import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './admin-sakura.css'

import { Session } from '../../App/reducer'
import produce from 'immer'

import { AdminSakuraState, SakuraModel, viewTypes } from './reducer'
import { DiscModel, SakuraOfDiscsModel } from './reducer-discs'
import { AdminSakuraList } from './admin-sakura-list'
import { AdminSakuraSave } from './admin-sakura-save'
import { AdminSakuraEdit } from './admin-sakura-edit'
import { AdminSakuraDiscs } from './admin-sakura-with-discs'

const compareList = (a: SakuraModel, b: SakuraModel) => {
  const indexA = viewTypes.findIndex(v => v.value === a.viewType)
  const indexB = viewTypes.findIndex(v => v.value === b.viewType)
  if (indexA !== indexB) {
    return indexA - indexB
  }
  if (a.viewType !== 'PrivateList') {
    return b.key.localeCompare(a.key)
  } else {
    return a.key.localeCompare(b.key)
  }
}

const compareDisc = (a: DiscModel, b: DiscModel) => {
  if (a.surplusDays !== b.surplusDays) {
    return a.surplusDays - b.surplusDays
  }
  return a.title.localeCompare(b.title)
}

export type OwnProps = RouteComponentProps<{}>

interface Props extends AdminSakuraState, OwnProps {
  session: Session
  saveModel: (model: {}) => void
  editModel: (id: number, model: {}) => void
  dropModel: (id: number) => void
  pushDiscs: (id: number, pid: number) => void
  dropDiscs: (id: number, pid: number) => void
  searchDisc: (id: number, asin: string) => void
}

export function AdminSakura(props: Props) {

  function withModels(render: (models: SakuraModel[]) => React.ReactNode) {
    if (props.models) {
      const newModels = produce(props.models, draft => {
        draft.sort(compareList)
      })
      return render(newModels)
    }
    return null
  }

  function withDetail(key: string, render: (detail: SakuraModel) => React.ReactNode) {
    if (props.detail && props.detail.key === key) {
      return render(props.detail)
    }
    return null
  }

  function withDetailOfDiscs(key: string, render: (detail: SakuraOfDiscsModel) => React.ReactNode) {
    if (props.detailOfDiscs && props.detailOfDiscs.key === key) {
      const newDetail = produce(props.detailOfDiscs, draftState => {
        draftState.discs.sort(compareDisc)
      })
      return render(newDetail)
    }
    return null
  }

  return (
    <div className="admin-sakura">
      {props.message && (
        <div>
          <Breadcrumb style={{padding: 10}}>
            <Breadcrumb.Item>
              <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Alert message={props.message} type="error"/>
        </div>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withModels(models => (
            <div className="admin-sakura-list">
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/save`}>添加{props.pageInfo.modelName}</Link>
                </Breadcrumb.Item>
              </Breadcrumb>
              <div style={{paddingBottom: 10}}>
                <Alert message="点击编辑，编辑列表信息；点击标题，进入碟片管理"/>
              </div>
              <AdminSakuraList
                models={models}
                editModelTo={t => `${props.match.url}/${t.key}`}
                editDiscsTo={t => `${props.match.url}/${t.key}/discs`}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/save`}
          exact={true}
          render={() => (
            <div className="admin-sakura-save">
              <Helmet>
                <title>创建{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  创建{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              <AdminSakuraSave
                pageInfo={props.pageInfo}
                saveModel={props.saveModel}
              />
            </div>
          )}
        />
        <Route
          path={`${props.match.url}/:key`}
          exact={true}
          render={({match}) => withDetail(match.params.key, detail => (
            <div className="admin-sakura-edit">
              <Helmet>
                <title>编辑{props.pageInfo.modelName} - {detail.title} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  编辑{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              {detail.drop && (
                <Alert
                  message={`${props.pageInfo.modelName}已被删除`}
                  type="error"
                />
              )}
              {detail.drop || (
                <AdminSakuraEdit
                  detail={detail}
                  session={props.session}
                  pageInfo={props.pageInfo}
                  editModel={props.editModel}
                  dropModel={props.dropModel}
                />
              )}
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:key/discs`}
          exact={true}
          render={({match}) => withDetailOfDiscs(match.params.key, detail => (
            <div className="admin-sakura-discs">
              <Helmet>
                <title>碟片管理 - {detail.title} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  碟片管理
                </Breadcrumb.Item>
              </Breadcrumb>
              <AdminSakuraDiscs
                detail={detail}
                search={props.searchOfDiscs}
                pushDiscs={props.pushDiscs}
                dropDiscs={props.dropDiscs}
                searchDisc={props.searchDisc}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
