import React from 'react'
import { Link } from 'react-router-dom'
import { Alert } from 'antd'
import { QuestionOutlined } from '@ant-design/icons'
import { useData } from '../../hooks/useData'
import { useTitle } from '../../hooks/hooks'
import { CustomDate } from '../../comps/CustomDate'
import { CustomLink } from '../../comps/CustomLink'
import { Column, Table } from '../../comps/@table/Table'
import { CustomPagination } from '../../comps/CustomPagination'
import { RouteProps } from '../@types'
import './DiscComing.scss'

interface DiscComing {
  id: number
  asin: string
  type?: string
  title: string
  discId?: number
  createOn: number
}

const cols = getColumns()

export default function DiscComing({ location, history }: RouteProps<void>) {

  const query = location.search ? location.search + '&sort=id,desc' : '?sort=id,desc'
  const [{ data, page, error }, handler] = useData<DiscComing[]>(`/api/shelfs${query}`)

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      history.push(`/disc_coming?page=${page}`)
    } else {
      history.push(`/disc_coming?page=${page}&size=${pageSize}`)
    }
  }

  useTitle('上架追踪')

  return (
    <div className="DiscComing">
      {error && (
        <Alert message={error} type="error" />
      )}
      {data && (
        <Table cols={cols} rows={data} title="上架追踪" handler={handler} />
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange} />
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
      format: (t) => t.asin,
      tdClass: createJustUpdateTdClass()
    },
    {
      key: 'createOn',
      title: '抓取时间',
      format: (t) => <CustomDate time={t.createOn} />,
      tdClass: createJustUpdateTdClass()
    },
    {
      key: 'followed',
      title: <QuestionOutlined />,
      format: (t) => t.discId ? <Link to={`/discs/${t.discId}`}>已有</Link> : '暂无'
    },
    {
      key: 'type',
      title: '类型',
      format: formatType
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (t) => <CustomLink href={`http://www.amazon.co.jp/dp/${t.asin}`} title={t.title} />
    },
  ]
}

function formatType(t: DiscComing) {
  if (t.type === undefined) return '---'
  return t.type === 'Blu-ray' ? 'BD' : t.type
}

function createJustUpdateTdClass() {
  return (t: DiscComing) => ({
    'just-update-in-06-hour': justUpdateIn06Hour(t),
    'just-update-in-24-hour': justUpdateIn24Hour(t),
  })
}

function justUpdateIn06Hour(t: DiscComing) {
  return Date.now() - t.createOn < 6 * 3600 * 1000
}

function justUpdateIn24Hour(t: DiscComing) {
  return Date.now() - t.createOn < 24 * 3600 * 1000
}
