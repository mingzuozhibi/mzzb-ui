import { MzHeader } from '#CC/header/MzHeader'
import { MzLink } from '#CC/link/MzLink'
import { MzPagination } from '#CC/pagination/MzPagination'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { AllColumns } from '#CC/warpper/AllColumns'
import './DiscComing.scss'

import { useLocal } from '#CH/useLocal'
import { useResult } from '#CH/useOnce'
import { CheckCircleTwoTone, PlusSquareTwoTone } from '@ant-design/icons'
import { Input, Select, Space } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import useUrlState from '@ahooksjs/use-url-state'
import dayjs from 'dayjs'

import { IComing } from '#DT/disc'
import { isJustUpdate } from '#RU/check'
import { apiToSpider, linkToAmazon, linkToDiscs } from '#RU/links'

const cols = buildColumns()

export default function DiscComing() {
  const location = useLocation()
  const apiUrl = apiToSpider(`/historys${location.search}`)

  const { data: result, ...state } = useResult<IComing[]>(apiUrl, {
    refreshDeps: [apiUrl],
    autoScroll: true,
  })
  const { data: rows, page } = result ?? {}

  const [urlState, setUrlState] = useUrlState<any>({ page: 1, size: 20 })
  const initial: { title?: string } = { title: urlState.title }

  const onSearch = (title: string) => setUrlState({ page: 1, title })
  const onPageChange = (page: number, size: number = 20) => {
    setUrlState({ page, size })
  }

  const [viewMode, setViewMode] = useLocal<'all' | 'auto'>('coming-viewmode', 'auto')
  const viewSelect = (
    <Select key="K1" value={viewMode} onChange={setViewMode}>
      <Select.Option value="all">所有列</Select.Option>
      <Select.Option value="auto">智能列</Select.Option>
    </Select>
  )

  const maxWidth = viewMode === 'all' ? '100%' : '800px'

  return (
    <div className="DiscComing" style={{ maxWidth }}>
      <MzHeader title="上架追踪" state={state} extra={[viewSelect]} />
      <Space direction="vertical">
        <Input.Search
          size="large"
          defaultValue={initial.title}
          placeholder="input search text"
          allowClear={true}
          enterButton="Search"
          onSearch={onSearch}
        />
        {page && <MzPagination page={page} onChange={onPageChange} />}
        {rows && (
          <AllColumns viewMode={viewMode}>
            <MzTable tag="coming" rows={rows} cols={cols} />
          </AllColumns>
        )}
        {page && <MzPagination page={page} onChange={onPageChange} />}
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
      <Link to={linkToDiscs(`/asin/${row.asin}`)}>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </Link>
    )
  } else {
    return (
      <Link to={linkToDiscs(`/add`)} state={row}>
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
