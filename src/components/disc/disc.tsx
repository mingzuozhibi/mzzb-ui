import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import './disc.css'

import { DiscOfRanksModel, DiscOfRecordsModel, DiscState } from './reducer'
import {
  adminDiscRecordsMessage, adminDiscViewMessage, discRecordsMessage,
  discViewMessage
} from '../../common/site-messages'
import { DiscRecords } from './disc-records'
import { DiscView } from './disc-view'
import { Command } from '../../lib/command'
import { Session } from '../../App/reducer'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends DiscState, OwnProps {
  session: Session
  editModel: (id: number, model: {}) => void
  mergeRanks: (id: number, model: {}) => void
  mergePts: (id: number, model: {}) => void
}

export function Disc(props: Props) {

  function withDetail(id: string, render: (detail: DiscOfRanksModel) => React.ReactNode) {
    if (props.detail && props.detail.id === parseInt(id, 10)) {
      return render(props.detail)
    }
    return null
  }

  function findDetail(key: string, value: string, render: (detail: DiscOfRanksModel) => React.ReactNode) {
    if (props.detail && props.detail[key] === value) {
      return render(props.detail)
    }
    return null
  }

  function withDetailOfRecords(id: string, render: (detail: DiscOfRecordsModel) => React.ReactNode) {
    if (props.detailOfRecords && props.detailOfRecords.id === parseInt(id, 10)) {
      return render(props.detailOfRecords)
    }
    return null
  }

  function pushToRecords() {
    const matchUrl = props.location.pathname
    props.history.push(matchUrl.substring(0, matchUrl.length - 8), props.location.state)
  }

  function pushToView() {
    const matchUrl = props.location.pathname
    props.history.push(`${matchUrl}/records`, props.location.state)
  }

  const hasBasicRole = props.session.userRoles.some(role => role === 'ROLE_BASIC')

  function renderDetail(detail: DiscOfRanksModel) {
    return (
      <div className="disc-view">
        <Helmet>
          <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
        </Helmet>
        <Breadcrumb style={{ padding: 10 }}>
          <Breadcrumb.Item>
            {props.pageInfo.pageTitle}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Command onClick={pushToView}>排名数据</Command>
          </Breadcrumb.Item>
        </Breadcrumb>
        {hasBasicRole && adminDiscViewMessage && (
          <div className="form-message">
            {adminDiscViewMessage}
          </div>
        )}
        {!hasBasicRole && discViewMessage && (
          <div className="form-message">
            {discViewMessage}
          </div>
        )}
        <DiscView
          detail={detail}
          editModel={props.editModel}
          hasBasicRole={hasBasicRole}
        />
      </div>
    )
  }

  return (
    <div className="disc">
      {props.message && (
        <div>
          <Alert message={props.message} type="error"/>
        </div>
      )}
      <Switch>
        <Route
          path={`${props.match.url}/find/:key/:value`}
          exact={true}
          render={({match}) => findDetail(match.params.key, match.params.value, renderDetail)}
        />
        <Route
          path={`${props.match.url}/:id`}
          exact={true}
          render={({match}) => withDetail(match.params.id, renderDetail)}
        />
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
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Command onClick={pushToView}>排名数据</Command>
                </Breadcrumb.Item>
              </Breadcrumb>
              {hasBasicRole && adminDiscViewMessage && (
                <div className="form-message">
                  {adminDiscViewMessage}
                </div>
              )}
              {!hasBasicRole && discViewMessage && (
                <div className="form-message">
                  {discViewMessage}
                </div>
              )}
              <DiscView
                detail={detail}
                editModel={props.editModel}
                hasBasicRole={hasBasicRole}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:id/records`}
          exact={true}
          render={({match}) => withDetailOfRecords(match.params.id, detail => (
            <div className="disc-records">
              <Helmet>
                <title>排名数据 - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Command onClick={pushToRecords}>碟片信息</Command>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  排名数据
                </Breadcrumb.Item>
              </Breadcrumb>
              {hasBasicRole && adminDiscRecordsMessage && (
                <div className="form-message">
                  {adminDiscRecordsMessage}
                </div>
              )}
              {!hasBasicRole && discRecordsMessage && (
                <div className="form-message">
                  {discRecordsMessage}
                </div>
              )}
              <DiscRecords
                detail={detail}
                mergeRanks={props.mergeRanks}
                mergePts={props.mergePts}
                hasBasicRole={hasBasicRole}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
