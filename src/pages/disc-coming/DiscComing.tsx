import { MzHeader } from '#C/header/MzHeader'
import { MzLink } from '#C/link/MzLink'
import { MzPagination } from '#C/pagination/MzPagination'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { CheckCircleTwoTone, PlusSquareTwoTone } from '@ant-design/icons'
import { Space } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './DiscComing.scss'

import { linkToAmazon, linkToAsin } from '#A/links'
import { IComing } from '#T/disc'
import { isJustUpdate } from '#U/date/check'
import dayjs from 'dayjs'

const cols = buildColumns()

export default function DiscComing() {
  const location = useLocation()
  const navigate = useNavigate()

  const url = `/api/spider/discShelfs${location.search}`
  const { ...state } = useOnceRequest(() => fetchResult<IComing[]>(url), {
    refreshDeps: [location.search],
  })
  const { data, page } = state.data ?? {}

  function onPaginationChange(page: number, size: number = 20) {
    if (size === 20) {
      navigate(`/disc_coming?page=${page}`)
    } else {
      navigate(`/disc_coming?page=${page}&size=${size}`)
    }
  }

  return (
    <div className="DiscComing" style={{ maxWidth: 800 }}>
      <MzHeader title="上架追踪" state={state} />
      <Space direction="vertical">
        {page && <MzPagination page={page} onChange={onPaginationChange} />}
        {data && <MzTable tag="coming" rows={data} cols={cols} />}
        {page && <MzPagination page={page} onChange={onPaginationChange} />}
      </Space>
    </div>
  )
}

function buildColumns(): MzColumn<IComing>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: formatAsin,
      tdClass: tdClassCreateOn,
    },
    {
      key: 'createOn',
      title: '抓取时间',
      format: formatCreateOn,
      tdClass: tdClassCreateOn,
    },
    {
      key: 'type',
      title: '类型',
      format: formatType,
    },
    {
      key: 'date',
      title: '发售',
      format: formatDate,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
    },
  ]
}

function formatAsin(row: IComing) {
  return row.asin
}

function formatCreateOn(row: IComing) {
  const _3months = dayjs().subtract(3, 'months')
  const datetime = dayjs(row.createOn)
  const recently = datetime.isAfter(_3months)
  return recently ? (
    <div>
      <div>{datetime.format('MM/DD')}</div>
      <div>{datetime.format('HH:mm:ss')}</div>
    </div>
  ) : (
    <div>
      <div>{datetime.format('YYYY')}</div>
      <div>{datetime.format('MM/DD')}</div>
    </div>
  )
}

function tdClassCreateOn(row: IComing) {
  return {
    'just-update-in-1': isJustUpdate(row.createOn, 12),
    'just-update-in-2': isJustUpdate(row.createOn, 24),
  }
}

function formatType(row: IComing) {
  return (
    <div>
      <div>{row.type === 'Blu-ray' ? 'BD' : row.type}</div>
      <div>{formatFollowed(row)}</div>
    </div>
  )
}

function formatFollowed(row: IComing) {
  if (row.tracked) {
    return (
      <Link to={linkToAsin(row.asin)}>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </Link>
    )
  } else {
    return (
      <Link to={`/discs/add`} state={row}>
        <PlusSquareTwoTone twoToneColor="#eb2f96" />
      </Link>
    )
  }
}

function formatDate(row: IComing) {
  if (row.date === undefined) {
    return '-'
  }
  const date = dayjs(row.date)
  return (
    <div>
      <div>{date.format('YYYY')}</div>
      <div>{date.format('MM/DD')}</div>
    </div>
  )
}

function formatTitle(row: IComing) {
  return <MzLink href={linkToAmazon(row.asin)} title={row.title} />
}
