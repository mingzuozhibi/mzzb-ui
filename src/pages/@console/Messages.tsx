import { RefreshButton } from '#C/button/Refresh'
import { MzCheckbox } from '#C/checkbox/MzCheckbox'
import { MzLink } from '#C/link/MzLink'
import { MzPagination } from '#C/pagination/MzPagination'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { UrlBuilder } from '#U/fetch/urlBuilder'
import { Alert, Input, Space } from 'antd'
import { useEffect, useState } from 'react'
import './Messages.scss'

import { linkToAsin } from '#A/links'
import { msgLevels } from '#A/metas'
import { useOnceRequest } from '#H/useOnce'
import { formatDDMM, formatTime } from '#U/date/format'
import { fetchResult } from '#U/fetch/fetchResult'

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

const initTypes = msgLevels.map((e) => e.value)
const cols = buildColumns()

export default function Messages({ name, activeKey }: Props) {
  const [types, setTypes] = useState(initTypes)
  const [param, setParam] = useState({ page: 1, size: 20 })
  const [query, setQuery] = useState('')

  const url = new UrlBuilder(`/api/messages/${name}`)
    .append('types', types.join(','))
    .append('page', `${param.page}`)
    .append('size', `${param.size}`)
    .append('search', query)
    .toString()

  const { data: result, ...state } = useOnceRequest(() => fetchResult<IMsg[]>(url))
  const { data: msgs, page } = result ?? {}

  useEffect(() => {
    if (activeKey === name && !state.loading) {
      state.refresh()
    }
  }, [activeKey])

  function onChangePage(page: number, size: number = 20) {
    setParam({ page, size })
    window.scroll(0, 0)
  }

  function onChangeTypes(checked: any[]) {
    setTypes(checked)
    setParam({ page: 1, size: param.size })
  }

  function onSearch(value: string) {
    setQuery(value)
    setParam({ page: 1, size: param.size })
  }

  return (
    <div className="Messages">
      <Space direction="vertical">
        {state.error && <Alert message={state.error.message} type="error" />}
        {msgs && (
          <>
            <MzCheckbox
              prefix={<RefreshButton state={state} />}
              options={msgLevels}
              value={types}
              onChange={onChangeTypes}
            />
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            />
          </>
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
          {formatDDMM(row.createOn)}
          <br />
          {formatTime(row.createOn)}
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
