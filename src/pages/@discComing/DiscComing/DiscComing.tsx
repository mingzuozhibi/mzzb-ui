import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert } from 'antd'

import { useTitle } from '../../../hooks/hooks'
import { useData } from '../../../hooks/useData'
import { Column, Table } from '../../../comps/@table/Table'
import { CustomPagination } from '../../../comps/CustomPagination'
import { CustomLink } from '../../../comps/CustomLink'

import './DiscComing.scss'

interface DiscComing {
  id: number
  asin: string
  title: string
  followed: boolean
  createTime: number
}

const cols = getColumns()

export default function DiscComing({location, history}: RouteComponentProps<void>) {

  useTitle('上架追踪')

  const [{data, page, error}, handler] = useData<DiscComing[]>(`/api/discComing${location.search}`)

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      history.push(`/disc_coming?page=${page}`)
    } else {
      history.push(`/disc_coming?page=${page}&pageSize=${pageSize}`)
    }
  }

  return (
    <div className="DiscComing">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table cols={cols} rows={data} title="上架追踪" handler={handler}/>
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange}/>
      )}
    </div>
  )
}

function getColumns(): Column<DiscComing>[] {
  return [
    {
      key: 'id',
      title: 'ID',
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
      format: (t) => t.followed ? <Link to={`/discs/asin/${t.asin}`}>有</Link> : '无'
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
      title: '碟片标题',
      format: (t) => <CustomLink href={`http://www.amazon.co.jp/dp/${t.asin}`} title={t.title}/>
    },
  ]
}

function formatCreateTime(t: DiscComing) {
  const date = new Date(t.createTime)
  return `${date.toLocaleDateString()} ${date.getHours()}时${date.getMinutes()}分`
}

function justUpdateIn6Hour(t: DiscComing) {
  return Date.now() - t.createTime < 6 * 3600 * 1000
}

function justUpdateIn12Hour(t: DiscComing) {
  return Date.now() - t.createTime < 12 * 3600 * 1000
}
