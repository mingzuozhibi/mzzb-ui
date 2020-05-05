import React, { useState } from 'react'
import { Alert, Button, Checkbox } from 'antd'
import { useData } from '../../hooks/useData'
import { CustomDate } from '../../comps/CustomDate'
import { CustomLink } from '../../comps/CustomLink'
import { Column, Table } from '../../comps/@table/Table'
import { CustomPagination } from '../../comps/CustomPagination'
import './Messages.scss'

const LEVELS = ['DEBUG', 'INFO', 'NOTIFY', 'SUCCESS', 'WARN', 'ERROR']
type Level = 'DEBUG' | 'INFO' | 'NOTIFY' | 'SUCCESS' | 'WARN' | 'ERROR'

export interface Message {
  id: number
  level: Level,
  content: string,
  createOn: number,
  acceptOn: number,
}

interface Props {
  index: string
}

export default function Messages({ index }: Props) {

  const [levels, setLevels] = useState(LEVELS)
  const [{ pageNumber, pageSize }, setPage] = useState({ pageNumber: 1, pageSize: 50 })
  const url = `/api/messages/${index}?levels=${levels.join(',')}&page=${pageNumber}&size=${pageSize}&sort=id,desc`
  const [{ error, data, page }, handler] = useData<Message[]>(url)

  data && data.forEach((e, i) => e.id = i)

  const cols = getCols()

  function onPaginationChange(page: number, pageSize?: number) {
    setPage({ pageNumber: page, pageSize: pageSize || 50 })
    window.scroll(0, 0)
  }

  function onChangeLevels(levels: any[]) {
    setLevels(levels)
  }

  return (
    <div className="Messages">
      {error && (
        <Alert message={error} type="error" />
      )}
      {data && (
        <div style={{ marginBottom: 10 }}>
          <Button
            children={'刷新'}
            onClick={handler.refresh}
            loading={handler.loading}
            style={{ marginRight: 10 }}
          />
          <Checkbox.Group onChange={onChangeLevels} value={levels}>
            <Checkbox value="DEBUG">调试</Checkbox>
            <Checkbox value="INFO">信息</Checkbox>
            <Checkbox value="NOTIFY">通知</Checkbox>
            <Checkbox value="SUCCESS">成功</Checkbox>
            <Checkbox value="WARN">警告</Checkbox>
            <Checkbox value="ERROR">错误</Checkbox>
          </Checkbox.Group>
        </div>
      )}
      {page && (
        <div style={{ marginBottom: 10 }}>
          <CustomPagination page={page} onChange={onPaginationChange} />
        </div>
      )}
      {data && (
        <Table
          cols={cols}
          rows={data}
          trClass={trClass}
        />
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange} />
      )}
    </div>
  )
}

function getCols(): Column<Message>[] {
  return [
    {
      key: 'time',
      title: '时间',
      format: t => <CustomDate time={t.createOn} />
    },
    {
      key: 'level',
      title: '级别',
      format: t => t.level
    },
    {
      key: 'text',
      title: '消息内容',
      format: formatText
    },
  ]
}

function trClass(t: Message) {
  return {
    'debug': t.level === "DEBUG",
    'info': t.level === "NOTIFY",
    'warning': t.level === "WARN",
    'success': t.level === 'SUCCESS',
    'danger': t.level === 'ERROR',
  }
}

const re = /\[([A-Z0-9]{10})\]/

function formatText(t: Message) {
  const result = re.exec(t.content)
  if (result) {
    return <>
      {t.content.substring(0, result.index + 1)}
      <CustomLink href={`/discs/asin/${result[1]}`} title={result[1]} />
      {t.content.substring(result.index + 11)}
    </>
  } else {
    return t.content
  }
}
