import { MzHeader } from '#CC/header/MzHeader'
import { MzLink } from '#CC/link/MzLink'
import { MzPagination } from '#CC/pagination/MzPagination'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { MzTransfer } from '#CC/transfer/MzTransfer'
import { AllColumns } from '#CC/warpper/AllColumns'
import './DiscComing.scss'

import { useSession } from '#CH/useLocal'
import { useResult } from '#CH/useOnce'
import { useSearch } from '#CH/useSearch'
import { CheckCircleTwoTone, PlusSquareTwoTone } from '@ant-design/icons'
import { AutoComplete, Checkbox, Input, Radio, Space } from 'antd'
import { useMemo } from 'react'
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom'

import { IComing } from '#DT/disc'
import { comingTypes } from '#DT/metas'
import { isJustUpdate } from '#RU/check'
import { apiToSpider, linkToAmazon, linkToDiscs } from '#RU/links'
import dayjs from 'dayjs'

interface Initial {
  asin?: string
  type?: string
  title?: string
  tracked?: boolean
  sortKeys?: string[]
}

const sorts = [
  { title: '抓取时间', key: 'id,desc' },
  { title: '碟片类型', key: 'type' },
  { title: '发售日期', key: 'date,desc' },
  { title: '碟片标题', key: 'title' },
]

export default function DiscComing() {
  const navigate = useNavigate()
  const cols = useMemo(() => buildColumns(navigate), [navigate])

  const location = useLocation()
  const apiUrl = apiToSpider(`/historys${location.search}`)

  const { data: result, ...state } = useResult<IComing[]>(apiUrl, {
    refreshDeps: [apiUrl],
    autoScroll: true,
  })
  const { data: rows, page } = result ?? {}

  const [urlState, setUrlState] = useSearch<any>(
    { page: 1, size: 20 },
    { arrayNames: ['sort'], booleanNames: ['tracked'] }
  )

  const initial: Initial = {
    asin: urlState.asin,
    type: urlState.type,
    title: urlState.title,
    tracked: urlState.tracked,
    sortKeys: urlState.sort,
  }

  const onSearch = (title: string) => setUrlState({ page: 1, title })
  const onPageChange = (page: number, size: number = 20) => {
    setUrlState({ page, size })
  }
  const onSortChange = (keys: string[]) => setUrlState({ page: 1, sort: keys })

  const [options, setOptions] = useSession('coming-options', {
    showSearch: false,
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
                children="高级搜索"
                checked={options.showSearch}
                onChange={(e) => setOptions({ ...options, showSearch: e.target.checked })}
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
        <Input.Search
          size="large"
          defaultValue={initial.title}
          placeholder="请输入碟片标题以查询"
          allowClear={true}
          enterButton="Search"
          onSearch={onSearch}
        />
        {options.showSearch && (
          <Space wrap={true}>
            <MzTransfer items={sorts} defaultKeys={initial.sortKeys} onChange={onSortChange} />
            <Space direction="vertical">
              <div className="input-warpper compact">
                <div className="input-label">碟片ASIN</div>
                <Input
                  style={{ width: 200 }}
                  placeholder="输入碟片ASIN以查询"
                  allowClear={true}
                  value={initial.asin}
                  onChange={(e) => setUrlState({ page: 1, asin: e.target.value })}
                />
              </div>
              <div className="input-warpper compact">
                <div className="input-label">碟片类型</div>
                <AutoComplete
                  style={{ width: 200 }}
                  options={comingTypes.map((e) => ({ value: e }))}
                  placeholder="输入碟片类型以查询"
                  allowClear={true}
                  value={initial.type}
                  onChange={(type) => setUrlState({ page: 1, type })}
                />
              </div>
              <div className="input-warpper compact">
                <div className="input-label">追踪情况</div>
                <Radio.Group
                  value={initial.tracked}
                  onChange={(e) => setUrlState({ page: 1, tracked: e.target.value })}
                >
                  <Radio value={true}>已追踪</Radio>
                  <Radio value={false}>未追踪</Radio>
                  <Radio value={undefined}>不过滤</Radio>
                </Radio.Group>
              </div>
            </Space>
          </Space>
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

function buildColumns(navigate: NavigateFunction): MzColumn<IComing>[] {
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
      tdClick: (row) => tdClassType(row, navigate),
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
      <div>{row.type}</div>
      <div>
        {row.tracked ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <PlusSquareTwoTone twoToneColor="#eb2f96" />
        )}
      </div>
    </div>
  )
}

function tdClassType(row: IComing, navigate: NavigateFunction) {
  if (row.tracked) {
    navigate(linkToDiscs(`/asin/${row.asin}`))
  } else {
    navigate(linkToDiscs(`/add`), { state: row })
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
