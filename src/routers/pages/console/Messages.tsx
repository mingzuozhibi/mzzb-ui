import { RefreshButton } from '#CC/button/Refresh'
import { MzCheckbox } from '#CC/checkbox/MzCheckbox'
import { MzLink } from '#CC/link/MzLink'
import { MzPagination } from '#CC/pagination/MzPagination'
import { MzColumn, MzTable } from '#CC/table/MzTable'

import { useResult } from '#CH/useOnce'
import { UrlBuilder } from '#CU/urlBuilder'
import { Alert, DatePicker, Input, Space } from 'antd'
import { useEffect, useState } from 'react'
import './Messages.scss'

import { msgLevels } from '#DT/metas'
import { apiToMsgs, linkToDiscs } from '#RU/links'
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
  const [params, setParams] = useState<Params>({
    types: initTypes,
    page: 1,
    size: 20,
  })

  const apiUrl = new UrlBuilder(apiToMsgs(`/${name}`))
    .append('types', params.types.join(','))
    .append('search', params.query)
    .append('start', params.start)
    .append('end', params.end)
    .append('page', params.page)
    .append('size', params.size)
    .toString()

  const { data: result, ...state } = useResult<IMsg[]>(apiUrl, {
    refreshDeps: [apiUrl],
    autoScroll: true,
  })
  const { data: msgs, page } = result ?? {}

  useEffect(() => {
    if (activeKey === name && !state.loading) {
      state.refresh()
    }
  }, [activeKey])

  function onChangePage(page: number, size: number = 20) {
    setParams({ ...params, page, size })
    window.scroll(0, 0)
  }

  function onChangeTypes(checked: any[]) {
    setParams({ ...params, page: 1, types: checked })
    window.scroll(0, 0)
  }

  function onChangeRange(_moments: any, formats: [string, string]) {
    setParams({ ...params, page: 1, start: formats[0], end: formats[1] })
    window.scroll(0, 0)
  }

  function onSearch(value: string) {
    setParams({ ...params, page: 1, query: value })
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
        <MzLink href={linkToDiscs(`/asin/${asin}`)} title={asin} />
        {row.text.slice(result.index + 11)}
      </>
    )
  } else {
    return row.text
  }
}
