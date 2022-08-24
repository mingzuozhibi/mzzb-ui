import { QuestionOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import dayjs from 'dayjs'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './DiscComing.scss'

import { linkToAsin } from '#A/links'
import { MzLink } from '#C/link/MzLink'
import { MzPagination } from '#C/pagination/MzPagination'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useData } from '#H/useData'
import { useTitle } from '#H/useTitle'

interface DiscComing {
  id: number
  asin: string
  type?: string
  title: string
  tracked: boolean
  createOn: number
}

const cols = getColumns()

export default function DiscComing() {
  const location = useLocation()
  const navigate = useNavigate()

  const [{ data, page, error }, handler] = useData<DiscComing[]>(
    `/api/spider/discShelfs${location.search}`
  )

  function onPaginationChange(page: number, size: number = 20) {
    if (size === 20) {
      navigate(`/disc_coming?page=${page}`)
    } else {
      navigate(`/disc_coming?page=${page}&size=${size}`)
    }
  }

  useTitle('上架追踪')

  return (
    <div className="DiscComing">
      {error && <Alert message={error} type="error" />}
      {data && <MzTable cols={cols} rows={data} title="上架追踪" handler={handler} />}
      {page && <MzPagination page={page} onChange={onPaginationChange} />}
    </div>
  )
}

function getColumns(): MzColumn<DiscComing>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (row) => row.asin,
      tdClass: createJustUpdateTdClass(),
    },
    {
      key: 'createOn',
      title: '抓取时间',
      format: (row) => (
        <span>
          {dayjs(row.createOn).format('MM/DD')}
          <br />
          {dayjs(row.createOn).format('HH:mm:ss')}
        </span>
      ),
      tdClass: createJustUpdateTdClass(),
    },
    {
      key: 'followed',
      title: <QuestionOutlined />,
      format: (row) => (row.tracked ? <Link to={linkToAsin(row.asin)}>已有</Link> : '暂无'),
    },
    {
      key: 'type',
      title: '类型',
      format: formatType,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <MzLink href={`http://www.amazon.co.jp/dp/${row.asin}`} title={row.title} />,
    },
  ]
}

function formatType(row: DiscComing) {
  if (row.type === undefined) return '---'
  return row.type === 'Blu-ray' ? 'BD' : row.type
}

function createJustUpdateTdClass() {
  return (t: DiscComing) => ({
    'just-update-in-1': justUpdateIn12Hour(t),
    'just-update-in-2': justUpdateIn24Hour(t),
  })
}

function justUpdateIn12Hour(t: DiscComing) {
  return Date.now() - t.createOn < 12 * 3600 * 1000
}

function justUpdateIn24Hour(t: DiscComing) {
  return Date.now() - t.createOn < 24 * 3600 * 1000
}
