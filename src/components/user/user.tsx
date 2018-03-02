import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'

import { ViewportProps } from '../../hoc/Viewport'

import { UserModel, UserState } from './reducer'
import { UserEditAll } from './user-edit-all'
import { UserSave } from './user-save'
import { UserEditOne } from './user-edit-one'

export type OwnProps = ViewportProps & RouteComponentProps<{}>

interface Props extends UserState, OwnProps {
  saveModel: (model: {}) => void
  editModel: (id: number, model: {}) => void
}

export function User(props: Props) {

  function withEditAll(render: (editAll: UserModel[]) => React.ReactNode) {
    if (props.editAll) {
      return render(props.editAll)
    }
    return null
  }

  function withEditOne(id: string, render: (editOne: UserModel) => React.ReactNode) {
    if (props.editOne && props.editOne.id === parseInt(id, 10)) {
      return render(props.editOne)
    }
    return null
  }

  return (
    <div className="user-root">
      {props.message && (
        <Alert message={props.message} type="error"/>
      )}
      <Switch>
        <Route
          path={`${props.match.url}/edit`}
          exact={true}
          render={() => withEditAll(editAll => (
            <div className="user-edit-all">
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
              <UserEditAll
                models={editAll}
                viewport={props.viewport}
                pageInfo={props.pageInfo}
                editOneTo={t => `${props.match.url}/${t.id}/edit`}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/save`}
          exact={true}
          render={() => (
            <div className="user-save">
              <Helmet>
                <title>添加{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/edit`}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  添加{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              <UserSave
                pageInfo={props.pageInfo}
                saveModel={props.saveModel}
              />
            </div>
          )}
        />
        <Route
          path={`${props.match.url}/:id/edit`}
          exact={true}
          render={({match}) => withEditOne(match.params.id, editOne => (
            <div className="user-edit-one">
              <Helmet>
                <title>编辑{props.pageInfo.modelName} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={`${props.match.url}/edit`}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  编辑{props.pageInfo.modelName}
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className="form-message">
                提示: 用户密码可以留空，留空则继续使用原密码
              </div>
              <UserEditOne
                detail={editOne}
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
