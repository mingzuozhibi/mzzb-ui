import { useData, useTitle } from '##/hooks'
import { Column, Table } from '#C/@table/Table'
import { CustomDate } from '#C/CustomDate'
import { CustomLink } from '#C/CustomLink'
import { CustomPagination } from '#C/CustomPagination'
import { QuestionOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import { Link, useHistory, useLocation } from 'react-router-dom'
import './DiscComing.scss'

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
  const history = useHistory()
  const location = useLocation()

  const [{ data, page, error }, handler] = useData<DiscComing[]>(
    `/api/spider/discShelfs${location.search}`
  )

  function onPaginationChange(page: number, pageSize: number = 20) {
    if (pageSize === 20) {
      history.push(`/disc_coming?page=${page}`)
    } else {
      history.push(`/disc_coming?page=${page}&pageSize=${pageSize}`)
    }
  }

  useTitle('上架追踪')

  return (
    <div className="DiscComing">
      {error && <Alert message={error} type="error" />}
      {data && <Table cols={cols} rows={data} title="上架追踪" handler={handler} />}
      {page && <CustomPagination page={page} onChange={onPaginationChange} />}
    </div>
  )
}

function getColumns(): Column<DiscComing>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (t) => t.asin,
      tdClass: createJustUpdateTdClass(),
    },
    {
      key: 'createOn',
      title: '抓取时间',
      format: (t) => <CustomDate time={t.createOn} />,
      tdClass: createJustUpdateTdClass(),
    },
    {
      key: 'followed',
      title: <QuestionOutlined />,
      format: (t) => (t.tracked ? <Link to={`/discs/asin/${t.asin}`}>已有</Link> : '暂无'),
    },
    {
      key: 'type',
      title: '类型',
      format: formatType,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (t) => <CustomLink href={`http://www.amazon.co.jp/dp/${t.asin}`} title={t.title} />,
    },
  ]
}

function formatType(t: DiscComing) {
  if (t.type === undefined) return '---'
  return t.type === 'Blu-ray' ? 'BD' : t.type
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
