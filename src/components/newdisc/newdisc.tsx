import React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb, Pagination } from 'antd'
import { Link, RouteComponentProps } from 'react-router-dom'

import { NewDiscModel, NewDiscState } from './reducer'
import { Column, Table } from '../../lib/table'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends NewDiscState, OwnProps {
}

export function NewDisc(props: Props) {

  function getColumns(): Column<NewDiscModel>[] {
    return [
      {
        key: 'id',
        title: '#',
        format: (t) => t.id
      },
      {
        key: 'asin',
        title: 'ASIN',
        format: (t) => t.asin
      },
      {
        key: 'followed',
        title: '%',
        format: (t) => t.followed ? <Link to={`/disc/find/asin/${t.asin}`}>有</Link> : '无'
      },
      {
        key: 'createTime',
        title: '抓取时间',
        format: (t) => formatCreateTime(t)
      },
      {
        key: 'title',
        title: '标题',
        format: (t) => <a href={`http://www.amazon.co.jp/dp/${t.asin}`} target="_blank"
                          rel="noopener noreferrer">{t.title}</a>
      },
    ]
  }

  function formatCreateTime(t: NewDiscModel) {
    const date = new Date(t.createTime)
    return `${date.toLocaleDateString()} ${date.getHours()}时${date.getMinutes()}分`
  }

  return (
    <div className="newdisc">
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
        <div className="newdisc-content">
          <Helmet>
            <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
          </Helmet>
          <Breadcrumb style={{padding: 10}}>
            <Breadcrumb.Item>
              {props.pageInfo.pageTitle}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Table rows={props.models} columns={getColumns()}/>
          <Pagination
            showQuickJumper
            current={props.pageData.page + 1}
            total={(props.pageData.maxPage + 1) * props.pageData.maxSize}
            pageSize={props.pageData.maxSize}
            onChange={page => props.history.push(`/newdisc?page=${page - 1}`)}/>
        </div>
      )}
    </div>
  )
}
