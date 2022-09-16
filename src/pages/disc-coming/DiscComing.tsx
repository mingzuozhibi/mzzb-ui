import { MzLink } from '#C/link/MzLink'
import { MzPagination } from '#C/pagination/MzPagination'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { MzHeader } from '#C/header/MzHeader'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { CheckCircleTwoTone, PlusSquareTwoTone, QuestionOutlined } from '@ant-design/icons'
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
  const _3months = dayjs().subtract(3, 'months')
  const recently = dayjs(row.createOn).isAfter(_3months)
  return recently ? (
    <div>
      <div>{dayjs(row.createOn).format('MM/DD')}</div>
      <div>{dayjs(row.createOn).format('HH:mm:ss')}</div>
    </div>
  ) : (
    <div>
      <div>{dayjs(row.createOn).format('YYYY')}</div>
      <div>{dayjs(row.createOn).format('MM/DD')}</div>
    </div>
  )
}

function tdClassCreateOn(row: IComing) {
  return {
    'just-update-in-1': isJustUpdate(row.createOn, 12),
    'just-update-in-2': isJustUpdate(row.createOn, 24),
  }
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

function formatType(row: IComing) {
  return row.type === 'Blu-ray' ? 'BD' : row.type
}

function formatTitle(row: IComing) {
  return <MzLink href={linkToAmazon(row.asin)} title={row.title} />
}
