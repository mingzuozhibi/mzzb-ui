import { useState } from 'react'
import { Alert, Button, Radio } from 'antd'
import { useData } from '../../hooks/useData'
import { CustomDate } from '../../comps/CustomDate'
import { CustomLink } from '../../comps/CustomLink'
import { Column, Table } from '../../comps/@table/Table'
import { CustomPagination } from '../../comps/CustomPagination'
import './Messages.scss'

interface Data {
  id: number
  type: 'info' | 'success' | 'notify' | 'warning' | 'danger'
  text: string
  createOn: number
  acceptOn: number
}

interface Props {
  moduleName: string
}

export default function Messages({ moduleName }: Props) {
  const [messageType, setMessageType] = useState('info')
  const [{ pageNumber, pageSize }, setPage] = useState({ pageNumber: 1, pageSize: 40 })
  const url = `/gateway/messages/${moduleName}?type=${messageType}&page=${pageNumber}&pageSize=${pageSize}`
  const [{ error, data, page }, handler] = useData<Data[]>(url)

  data && data.forEach((e, i) => (e.id = i))

  const cols = getCols()

  function onPaginationChange(page: number, pageSize?: number) {
    setPage({ pageNumber: page, pageSize: pageSize || 40 })
    window.scroll(0, 0)
  }

  function onChangeType(e: any) {
    setMessageType(e.target.value)
  }

  return (
    <div className="Messages">
      {error && <Alert message={error} type="error" />}
      {data && (
        <div style={{ marginBottom: 10 }}>
          <Button
            children={'刷新'}
            onClick={handler.refresh}
            loading={handler.loading}
            style={{ marginRight: 10 }}
          />
          <Radio.Group onChange={onChangeType} value={messageType}>
            <Radio.Button value="info">所有</Radio.Button>
            <Radio.Button value="notify">通知</Radio.Button>
            <Radio.Button value="success">成功</Radio.Button>
            <Radio.Button value="warning">警告</Radio.Button>
            <Radio.Button value="danger">错误</Radio.Button>
          </Radio.Group>
        </div>
      )}
      {page && (
        <div style={{ marginBottom: 10 }}>
          <CustomPagination page={page} onChange={onPaginationChange} />
        </div>
      )}
      {data && <Table cols={cols} rows={data} trClass={trClass} />}
      {page && <CustomPagination page={page} onChange={onPaginationChange} />}
    </div>
  )
}

function getCols(): Column<Data>[] {
  return [
    {
      key: 'time',
      title: '时间',
      format: (t) => <CustomDate time={t.createOn} />,
    },
    {
      key: 'text',
      title: '消息内容',
      format: formatText,
    },
  ]
}

function trClass(t: Data) {
  return {
    warning: t.type === 'warning',
    success: t.type === 'success',
    danger: t.type === 'danger',
    info: t.type === 'notify',
  }
}

const re = /[\(\[]([A-Z0-9]{10})[\)\]]/

function formatText(t: Data) {
  const result = re.exec(t.text)
  if (result) {
    return (
      <>
        {t.text.substring(0, result.index + 1)}
        <CustomLink href={`/discs/asin/${result[1]}`} title={result[1]} />
        {t.text.substring(result.index + 11)}
      </>
    )
  } else {
    return t.text
  }
}
