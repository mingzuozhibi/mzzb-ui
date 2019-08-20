import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert } from 'antd'

import { useDocumentTitle } from '../../hooks/hooks'
import { useData } from '../../hooks/useData'
import { Column, Table } from '../../comps/table/Table'
import { CustomPagination } from '../../comps/antd'
import { Outlink } from '../../comps/html'

import './NewDiscs.scss'

interface NewDisc {
  id: number
  asin: string
  title: string
  followed: boolean
  createTime: number
}

const cols = getColumns()

export default function NewDiscs({location, history}: RouteComponentProps<void>) {

  useDocumentTitle('上架追踪')

  const [{data, page, error}, handler] = useData<NewDisc[]>(`/api/newdiscs2${location.search}`)

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      history.push(`/new_discs?page=${page}`)
    } else {
      history.push(`/new_discs?page=${page}&pageSize=${pageSize}`)
    }
  }

  return (
    <div className="NewDiscs">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table cols={cols} rows={data} handler={handler} mark="NewDiscs" title="上架追踪"/>
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange}/>
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
      format: (t) => <Outlink href={`http://www.amazon.co.jp/dp/${t.asin}`} title={t.title}/>
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
