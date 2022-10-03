import { RefreshButton } from '#C/button/Refresh'
import { MzCheckbox } from '#C/checkbox/MzCheckbox'
import { MzLink } from '#C/link/MzLink'
import { MzPagination } from '#C/pagination/MzPagination'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { UrlBuilder } from '#U/fetch/urlBuilder'
import { Alert, Card, DatePicker, Input, Space } from 'antd'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import './Messages.scss'

import { linkToAsin } from '#A/links'
import { msgLevels } from '#A/metas'
import dayjs from 'dayjs'

interface IMsg {
  id: number
  name: string
  type: 'DEBUG' | 'INFO' | 'NOTIFY' | 'SUCCESS' | 'WARNING' | 'ERROR'
  text: string
  createOn: number
  acceptOn: number
}

interface Props {
  name: string
  activeKey: string
}

interface Params {
  types: string[]
  query?: string
  start?: string
  end?: string
  page: number
  size: number
}

const initTypes = msgLevels.map((e) => e.value)
const cols = buildColumns()

export default function Messages({ name, activeKey }: Props) {
  const [params, setParams] = useImmer<Params>({
    types: initTypes,
    page: 1,
    size: 20,
  })

  const url = new UrlBuilder(`/api/messages/${name}`)
    .append('types', params.types.join(','))
    .append('search', params.query)
    .append('start', params.start)
    .append('end', params.end)
    .append('page', params.page)
    .append('size', params.size)
    .toString()

  const { data: result, ...state } = useOnceRequest(() => fetchResult<IMsg[]>(url), {
    refreshDeps: [url],
  })
  const { data: msgs, page } = result ?? {}

  useEffect(() => {
    if (activeKey === name && !state.loading) {
      state.refresh()
    }
  }, [activeKey])

  function onChangePage(page: number, size: number = 20) {
    setParams((draft) => {
      draft.page = page
      draft.size = size
    })
    window.scroll(0, 0)
  }

  function onChangeTypes(checked: any[]) {
    setParams((draft) => {
      draft.page = 1
      draft.types = checked
    })
    window.scroll(0, 0)
  }

  function onChangeRange(_moments: any, formats: [string, string]) {
    setParams((draft) => {
      draft.page = 1
      draft.start = formats[0]
      draft.end = formats[1]
    })
    window.scroll(0, 0)
  }

  function onSearch(value: string) {
    setParams((draft) => {
      draft.page = 1
      draft.query = value
    })
    window.scroll(0, 0)
  }

  return (
    <div className="Messages">
      <Space direction="vertical">
        {state.error && <Alert message={state.error.message} type="error" />}
        {msgs && (
          <Space wrap={true} style={{ maxWidth: 650 }}>
            <MzCheckbox
              prefix={<RefreshButton state={state} />}
              options={msgLevels}
              value={params.types}
              onChange={onChangeTypes}
            />
            <DatePicker.RangePicker
              format="YYYY/M/D"
              onChange={onChangeRange}
              allowEmpty={[true, true]}
            />
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="middle"
              onSearch={onSearch}
            />
          </Space>
        )}
        {page && <MzPagination page={page} onChange={onChangePage} />}
        {msgs && <MzTable tag="messages" cols={cols} rows={msgs} trClass={trClass} />}
        {page && <MzPagination page={page} onChange={onChangePage} />}
      </Space>
    </div>
  )
}

function buildColumns(): MzColumn<IMsg>[] {
  return [
    {
      key: 'time',
      title: '时间',
      format: (row) => (
        <span>
          {dayjs(row.createOn).format('MM/DD')}
          <br />
          {dayjs(row.createOn).format('HH:mm:ss')}
        </span>
      ),
    },
    {
      key: 'text',
      title: '消息内容',
      format: formatText,
    },
  ]
}

function trClass(row: IMsg) {
  return {
    debug: row.type === 'DEBUG',
    info: row.type === 'NOTIFY',
    success: row.type === 'SUCCESS',
    warning: row.type === 'WARNING',
    danger: row.type === 'ERROR',
  }
}

const re = /[\(\[]([A-Z0-9]{10})[\)\]]/

function formatText(row: IMsg) {
  const result = re.exec(row.text)
  if (result) {
    const asin = result[1]
    return (
      <>
        {row.text.slice(0, result.index + 1)}
        <MzLink href={linkToAsin(asin)} title={asin} />
        {row.text.slice(result.index + 11)}
      </>
    )
  } else {
    return row.text
  }
}
