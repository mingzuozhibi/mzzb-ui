import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'

import { AdminSakuraModel, AdminSakuraState } from './reducer'
import { AdminSakuraList } from './admin-sakura-list'
import { AdminSakuraSave } from './admin-sakura-save'
import { AdminSakuraEdit } from './admin-sakura-edit'

export type OwnProps = RouteComponentProps<{}>

interface AdminSakuraProps extends AdminSakuraState, OwnProps {
  saveModel: (model: {}) => void
  editModel: (model: {}) => void
}

export function AdminSakura(props: AdminSakuraProps) {

  function withModels(render: (models: AdminSakuraModel[]) => React.ReactNode) {
    if (props.models) {
      return render(props.models)
    }
    return null
  }

  function withDetail(key: string, render: (detail: AdminSakuraModel) => React.ReactNode) {
    if (props.detail && props.detail.key === key) {
      return render(props.detail)
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
              <AdminSakuraList
                models={models}
                editTo={t => `${props.match.url}/edit/${t.key}`}
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
      </Switch>
    </div>
  )
}
