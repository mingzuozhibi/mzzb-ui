import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, RouteComponentProps } from 'react-router-dom'

import { NewDiscModel, NewDiscState } from './reducer'
import { Column, Table } from '../../lib/table'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends NewDiscState, OwnProps {
}

function createPageLinks(props: Props) {
  const maxPage = props.pageData.maxPage
  const page = props.pageData.page

  let pages = Array(maxPage + 1).fill(0)
  if (pages.length > 10) {
    pages = pages.map((value, index) => index).filter((value, index) => {
      if (index === 0 || index === maxPage) {
        return true
      }
      if (page < 5 && index < 10) {
        return true
      }
      if (maxPage - page < 5 && maxPage - index < 10) {
        return true
      }
      return Math.abs(page - index) < 5
    })
  }

  const nodes = []
  const style = {fontSize: 16, padding: '8px 12px'}
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i]
    const href = `${props.pageInfo.matchPath}?page=${p}`
    if (p === page) {
      nodes.push(<Link style={{...style, color: 'black'}} key={p} to={href}>{p}</Link>)
    } else {
      nodes.push(<Link style={style} key={p} to={href}>{p}</Link>)
    }
    if (i < pages.length - 1 && pages[i + 1] - pages[i] !== 1) {
      nodes.push('...')
    }
  }
  return nodes
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
        format: (t) => <a href={`http://www.amazon.co.jp/dp/${t.asin}`} target="_blank">{t.title}</a>
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
          {createPageLinks(props)}
        </div>
      )}
    </div>
  )
}
