import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './disc.css'

import { DiscModel, DiscOfRanksModel, DiscState } from './reducer'
import { DiscView } from './disc-view'
import { Session } from '../../App/reducer'
import { DiscRank } from './disc-rank'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends DiscState, OwnProps {
  session: Session
  editModel: (id: number, model: {}) => void
  setRecord: (id: number, model: {}) => void
}

export function Disc(props: Props) {

  function withDetail(id: string, render: (detail: DiscModel) => React.ReactNode) {
    if (props.detail && props.detail.id === parseInt(id, 10)) {
      return render(props.detail)
    }
    return null
  }

  function withDetailOfRanks(id: string, render: (detail: DiscOfRanksModel) => React.ReactNode) {
    if (props.detailOfRanks && props.detailOfRanks.id === parseInt(id, 10)) {
      return render(props.detailOfRanks)
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
            <div className="disc-view">
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
              {props.session.userRoles.find(role => role === 'ROLE-BASIC') && (
                <div className="form-message">
                  提示: 只有长标题、短标题、碟片类型、更新模式、发售日期可以修改
                </div>
              )}
              <DiscView
                detail={detail}
                session={props.session}
                editModel={props.editModel}
                setRecord={props.setRecord}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:id/ranks`}
          exact={true}
          render={({match}) => withDetailOfRanks(match.params.id, detail => (
            <div className="disc-ranks">
              <Helmet>
                <title>排名数据 - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.location.state.url}>
                    {props.location.state.title}
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  排名数据
                </Breadcrumb.Item>
              </Breadcrumb>
              <DiscRank
                detailOfRanks={detail}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
