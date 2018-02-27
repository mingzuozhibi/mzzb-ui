import * as React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { Alert, Breadcrumb } from 'antd'

import { AdminSakuraModel, AdminSakuraState } from './reducer'
import { CurrentState } from '../../App/current'
import { AdminSakuraList } from './admin-sakura-list'
import { AdminSakuraSave } from './admin-sakura-save'
import { AdminSakuraEdit } from './admin-sakura-edit'

export type OwnProps = RouteComponentProps<{}>

interface AdminSakuraProps extends AdminSakuraState, OwnProps {
  current: CurrentState
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
                <title>{props.current.route!.text} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.current.route!.text}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/save`}>添加列表</Link>
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
                <title>添加列表 - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.current.route!.text}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  添加列表
                </Breadcrumb.Item>
              </Breadcrumb>
              <AdminSakuraSave
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
                <title>编辑列表 - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.current.route!.text}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  编辑列表
                </Breadcrumb.Item>
              </Breadcrumb>
              <AdminSakuraEdit
                model={detail}
                editModel={props.editModel}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
