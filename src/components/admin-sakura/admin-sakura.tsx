import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './admin-sakura.css'

import { AdminSakuraState, DiscModel, SakuraModel, SakuraOfDiscsModel } from './reducer'
import { AdminSakuraList } from './admin-sakura-list'
import { AdminSakuraSave } from './admin-sakura-save'
import { AdminSakuraEdit } from './admin-sakura-edit'
import { AdminSakuraOfDiscs } from './admin-sakura-of-discs'
import { compareFactory } from '../../utils/compare'
import produce from 'immer'

const compareBySurplusDays = compareFactory({
  apply: (disc: DiscModel) => disc.surplusDays,
  check: (sday: number) => sday === undefined,
  compare: (a: number, b: number) => a - b
})

export type OwnProps = RouteComponentProps<{}>

interface AdminSakuraProps extends AdminSakuraState, OwnProps {
  saveModel: (model: {}) => void
  editModel: (id: number, model: {}) => void
  pushDisc: (id: number, pid: number) => void
  dropDisc: (id: number, pid: number) => void
}

export function AdminSakura(props: AdminSakuraProps) {

  function withModels(render: (models: SakuraModel[]) => React.ReactNode) {
    if (props.models) {
      const newModels = produce(props.models, draft => {
        draft.sort((a, b) => {
          if (a.viewType !== b.viewType) {
            return a.viewType === 'SakuraList' ? -1 : 1
          }
          return b.key.localeCompare(a.key)
        })
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
        draftState.discs.sort(compareBySurplusDays)
      })
      return render(newDetail)
    }
    return null
  }

  return (
    <div className="admin-sakura">
      {props.message && (
        <Alert message={props.message} type="error"/>
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
                editTo={t => `${props.match.url}/edit/${t.key}`}
                viewOfDiscTo={t => `${props.match.url}/of/discs/${t.key}`}
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
                <title>添加{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  添加{props.pageInfo.modelName}
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
          path={`${props.match.url}/edit/:key`}
          exact={true}
          render={({match}) => withDetail(match.params.key, detail => (
            <div className="admin-sakura-edit">
              <Helmet>
                <title>编辑{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  编辑{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              <AdminSakuraEdit
                detail={detail}
                pageInfo={props.pageInfo}
                editModel={props.editModel}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/of/discs/:key`}
          exact={true}
          render={({match}) => withDetailOfDiscs(match.params.key, detail => (
            <div className="admin-sakura-of-discs">
              <Helmet>
                <title>管理{props.pageInfo.modelName}碟片 - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  管理{props.pageInfo.modelName}碟片
                </Breadcrumb.Item>
              </Breadcrumb>
              <AdminSakuraOfDiscs
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
