import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'

import { ViewportProps } from '../../hoc/Viewport'

import { AdminUserState, UserModel } from './reducer'
import { AdminUserList } from './admin-user-list'
import { AdminUserSave } from './admin-user-save'
import { AdminUserEdit } from './admin-user-edit'

export type OwnProps = ViewportProps & RouteComponentProps<{}>

interface AdminUserProps extends AdminUserState, OwnProps {
  saveModel: (model: {}) => void
  editModel: (model: {}) => void
}

export function AdminUser(props: AdminUserProps) {

  function withModels(render: (models: UserModel[]) => React.ReactNode) {
    if (props.models) {
      return render(props.models)
    }
    return null
  }

  function withDetail(id: string, render: (detail: UserModel) => React.ReactNode) {
    if (props.detail && props.detail.id === parseInt(id, 10)) {
      return render(props.detail)
    }
    return null
  }

  return (
    <div className="admin-users">
      {props.message && (
        <Alert message={props.message} type="error"/>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withModels(models => (
            <div className="admin-user-list">
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
              <AdminUserList
                viewport={props.viewport}
                pageInfo={props.pageInfo}
                models={models}
                editTo={t => `${props.match.url}/edit/${t.id}`}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/save`}
          exact={true}
          render={() => (
            <div className="admin-user-save">
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
              <AdminUserSave
                pageInfo={props.pageInfo}
                saveModel={props.saveModel}
              />
            </div>
          )}
        />
        <Route
          path={`${props.match.url}/edit/:id`}
          exact={true}
          render={({match}) => withDetail(match.params.id, detail => (
            <div className="admin-user-edit">
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
              <div className="form-message">
                提示: 用户密码可以留空，留空则继续使用原密码
              </div>
              <AdminUserEdit
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
