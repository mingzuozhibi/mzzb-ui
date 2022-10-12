import { MzHeader } from '#CC/header/MzHeader'
import { MzLink } from '#CC/link/MzLink'
import { MzPagination } from '#CC/pagination/MzPagination'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { MzTransfer, MzTransferItem } from '#CC/transfer/MzTransfer'
import { AllColumns } from '#CC/warpper/AllColumns'
import './DiscComing.scss'

import { useSession } from '#CH/useLocal'
import { useResult } from '#CH/useOnce'
import { useSearch } from '#CH/useSearch'
import { CheckCircleTwoTone, PlusSquareTwoTone } from '@ant-design/icons'
import { Checkbox, Input, Space } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import { IComing } from '#DT/disc'
import { isJustUpdate } from '#RU/check'
import { apiToSpider, linkToAmazon, linkToDiscs } from '#RU/links'
import dayjs from 'dayjs'

interface Initial {
  title?: string
  sortKeys?: string[]
}

const cols = buildColumns()
const sortItems = buildSortItems()

export default function DiscComing() {
  const location = useLocation()
  const apiUrl = apiToSpider(`/historys${location.search}`)

  const { data: result, ...state } = useResult<IComing[]>(apiUrl, {
    refreshDeps: [apiUrl],
    autoScroll: true,
  })
  const { data: rows, page } = result ?? {}

  const [urlState, setUrlState] = useSearch<any>({ page: 1, size: 20 }, { arrayNames: ['sort'] })

  const initial: Initial = {
    title: urlState.title,
    sortKeys: urlState.sort,
  }

  const onSearch = (title: string) => setUrlState({ page: 1, title })
  const onPageChange = (page: number, size: number = 20) => {
    setUrlState({ page, size })
  }
  const onSortChange = (keys: string[]) => setUrlState({ page: 1, sort: keys })

  const [options, setOptions] = useSession('coming-options', {
    showSearch: true,
    showSort: false,
    allCols: false,
  })
  const maxWidth = options.allCols ? '100%' : '800px'

  return (
    <div className="DiscComing" style={{ maxWidth }}>
      <MzHeader
        title="上架追踪"
        state={state}
        items={[
          {
            key: 'showSearch',
            label: (
              <Checkbox
                children="显示搜索"
                checked={options.showSearch}
                onChange={(e) => setOptions({ ...options, showSearch: e.target.checked })}
              />
            ),
          },
          {
            key: 'showSort',
            label: (
              <Checkbox
                children="显示排序"
                checked={options.showSort}
                onChange={(e) => setOptions({ ...options, showSort: e.target.checked })}
              />
            ),
          },
          {
            key: 'allCols',
            label: (
              <Checkbox
                children="所有字段"
                checked={options.allCols}
                onChange={(e) => setOptions({ ...options, allCols: e.target.checked })}
              />
            ),
          },
        ]}
      />
      <Space direction="vertical">
        {options.showSearch && (
          <Input.Search
            size="large"
            defaultValue={initial.title}
            placeholder="请输入碟片标题以查询"
            allowClear={true}
            enterButton="Search"
            onSearch={onSearch}
          />
        )}
        {options.showSort && (
          <MzTransfer items={sortItems} defaultKeys={initial.sortKeys} onChange={onSortChange} />
        )}
        {page && <MzPagination page={page} onChange={onPageChange} />}
        {rows && (
          <AllColumns viewMode={options.allCols ? 'all' : 'auto'}>
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

function buildSortItems(): MzTransferItem[] {
  return [
    { key: 'type', title: '碟片类型' },
    { key: 'date,desc', title: '发售日期' },
    { key: 'title', title: '碟片标题' },
    { key: 'tracked', title: '已创建' },
  ]
}
