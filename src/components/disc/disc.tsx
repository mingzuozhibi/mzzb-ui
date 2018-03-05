import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './disc.css'

import { DiscModel, DiscState } from './reducer'
import { DiscView } from './disc-view'
import { Session } from '../../App/reducer'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends DiscState, OwnProps {
  session: Session
  editModel: (id: number, model: {}) => void
}

export function Disc(props: Props) {

  function withDetail(id: string, render: (detail: DiscModel) => React.ReactNode) {
    if (props.detail && props.detail.id === parseInt(id, 10)) {
      return render(props.detail)
    }
    return null
  }

  return (
    <div className="disc">
      {props.message && (
        <div>
          <Breadcrumb style={{padding: 10}}>
            <Breadcrumb.Item>
              <Link to={props.location.state.url}>
                {props.location.state.title}
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Alert message={props.message} type="error"/>
        </div>
      )}
      <Switch>
        <Route
          path={`${props.match.url}/:id`}
          exact={true}
          render={({match}) => withDetail(match.params.id, detail => (
            <div className="sakura-view">
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.location.state.url}>
                    {props.location.state.title}
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
              </Breadcrumb>
              <DiscView
                detail={detail}
                session={props.session}
                editModel={props.editModel}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
