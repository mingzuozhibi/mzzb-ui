import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert, Pagination } from 'antd'

import { outlink } from '../../lib/functions'
import { Column, Table } from '../../lib/table'
import { BaseModel } from '../../utils/manager'

import { useDocumentTitle } from '../hooks/hooks'
import { usePagedData } from '../hooks/PagedData'

import './NewDiscs.scss'

interface NewDisc extends BaseModel {
  asin: string
  title: string
  followed: boolean
  createTime: number
}

export default function NewDiscs(props: RouteComponentProps<{}>) {

  useDocumentTitle('上架追踪')

  const [{data, page, error}] = usePagedData<NewDisc>(`/api/newdiscs2${props.location.search}`)

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      return props.history.push(`/new_discs?page=${page}`)
    } else {
      return props.history.push(`/new_discs?page=${page}&pageSize=${pageSize}`)
    }
  }

  return (
    <div className="newdiscs">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table
          title="上架追踪"
          rows={data}
          columns={getColumns()}
        />
      )}
      {page && (
        <Pagination
          showSizeChanger
          showQuickJumper
          pageSize={page.pageSize}
          current={page.currentPage}
          total={page.totalElements}
          onChange={onPaginationChange}
          onShowSizeChange={onPaginationChange}
        />
      )}
    </div>
  )
}

function getColumns(): Column<NewDisc>[] {
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
      format: (t) => formatCreateTime(t),
      tdClass: (t) => ({
        'just-update-in-6-hour': justUpdateIn6Hour(t),
        'just-update-in-12-hour': justUpdateIn12Hour(t),
      })
    },
    {
      key: 'title',
      title: '标题',
      format: (t) => outlink(`http://www.amazon.co.jp/dp/${t.asin}`, t.title)
    },
  ]
}

function formatCreateTime(t: NewDisc) {
  const date = new Date(t.createTime)
  return `${date.toLocaleDateString()} ${date.getHours()}时${date.getMinutes()}分`
}

function justUpdateIn6Hour(t: NewDisc) {
  return Date.now() - t.createTime < 6 * 3600 * 1000
}

function justUpdateIn12Hour(t: NewDisc) {
  return Date.now() - t.createTime < 12 * 3600 * 1000
}
