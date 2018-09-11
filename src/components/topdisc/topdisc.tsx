import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, RouteComponentProps } from 'react-router-dom'
import './topdisc.css'

import { TopDiscModel, TopDiscState } from './reducer'
import { Column, Table } from '../../lib/table'
import { formatTimeout } from '../../utils/format'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends TopDiscState, OwnProps {
}

export function TopDisc(props: Props) {

  function getColumns(): Column<TopDiscModel>[] {
    return [
      {
        key: 'rank',
        title: 'Rank',
        format: (t) => t.rank
      },
      {
        key: 'title',
        title: '标题',
        format: (t) => <a href={`http://www.amazon.co.jp/dp/${t.asin}`} target="_blank">{t.title}</a>
      },
    ]
  }

  function trClass(t: TopDiscModel) {
    return t.isAnime ? 'is-anime' : 'no-anime'
  }

  return (
    <div className="topdisc">
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
      {props.models && (
        <div className="topdisc-content">
          <Helmet>
            <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
          </Helmet>
          <Breadcrumb style={{padding: 10}}>
            <Breadcrumb.Item>
              {props.pageInfo.pageTitle} 更新于{formatTimeout(props.updateOn!)}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Table rows={props.models} columns={getColumns()} trClass={trClass}/>
        </div>
      )}
    </div>
  )
}
