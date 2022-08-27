import { RefreshButton } from '#C/button/Refresh'
import { MzLink } from '#C/link/MzLink'
import { MzPagination } from '#C/pagination/MzPagination'
import { MyColumn, MyTable } from '#C/table/MyTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useOnceRequest } from '#H/useOnce'
import { isJustUpdate } from '#U/date/check'
import { fetchResult } from '#U/fetch/fetchResult'
import { QuestionOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './DiscComing.scss'

import { linkToAsin } from '#A/links'
import { IComing } from '#T/disc'

const cols = buildColumns()

export default function DiscComing() {
  const location = useLocation()
  const navigate = useNavigate()

  const { ...state } = useOnceRequest(() =>
    fetchResult<IComing[]>(`/api/spider/discShelfs${location.search}`)
  )
  const { data, page } = state.data ?? {}

  function onPaginationChange(page: number, size: number = 20) {
    if (size === 20) {
      navigate(`/disc_coming?page=${page}`)
    } else {
      navigate(`/disc_coming?page=${page}&size=${size}`)
    }
  }

  return (
    <div className="IComing">
      <MzTopbar
        title="上架追踪"
        error={state.error?.message}
        extra={<RefreshButton state={state} />}
      />
      {data && <MyTable tag="coming" rows={data} cols={cols} />}
      {page && <MzPagination page={page} onChange={onPaginationChange} />}
    </div>
  )
}

function buildColumns(): MyColumn<IComing>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (row) => row.asin,
      tdClass: tdClassCreateOn,
    },
    {
      key: 'createOn',
      title: '抓取时间',
      format: formatCreateOn,
      tdClass: tdClassCreateOn,
    },
    {
      key: 'followed',
      title: <QuestionOutlined />,
      format: formatFollowed,
    },
    {
      key: 'type',
      title: '类型',
      format: formatType,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
    },
  ]
}

function formatCreateOn(row: IComing) {
  return (
    <span>
      {dayjs(row.createOn).format('MM/DD')}
      <br />
      {dayjs(row.createOn).format('HH:mm:ss')}
    </span>
  )
}

function tdClassCreateOn(row: IComing) {
  return {
    'just-update-in-1': isJustUpdate(row.createOn, 12),
    'just-update-in-2': isJustUpdate(row.createOn, 24),
  }
}

function formatFollowed(row: IComing) {
  return row.tracked ? <Link to={linkToAsin(row.asin)}>已有</Link> : '暂无'
}

function formatType(row: IComing) {
  if (row.type === undefined) return '---'
  return row.type === 'Blu-ray' ? 'BD' : row.type
}

function formatTitle(row: IComing) {
  return <MzLink href={`http://www.amazon.co.jp/dp/${row.asin}`} title={row.title} />
}
