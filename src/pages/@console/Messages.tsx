import { useData } from '##/hooks'
import { Column, Table } from '#C/@table/Table'
import { CustomDate } from '#C/CustomDate'
import { CustomLink } from '#C/CustomLink'
import { CustomPagination } from '#C/CustomPagination'
import { Alert, Button, Checkbox } from 'antd'
import { useCallback, useState } from 'react'
import './Messages.scss'

interface Data {
  id: number
  name: string
  type: 'DEBUG' | 'INFO' | 'NOTIFY' | 'SUCCESS' | 'WARNING' | 'ERROR'
  text: string
  createOn: number
  acceptOn: number
}

interface Props {
  name: string
}

const options: any[] = [
  { label: '调试', value: 'DEBUG' },
  { label: '信息', value: 'INFO' },
  { label: '通知', value: 'NOTIFY' },
  { label: '成功', value: 'SUCCESS' },
  { label: '警告', value: 'WARNING' },
  { label: '错误', value: 'ERROR' },
]

const cols = getCols()

export default function Messages({ name }: Props) {
  const [types, setTypes] = useState('DEBUG,INFO,NOTIFY,SUCCESS,WARNING,ERROR')
  const [param, setParam] = useState({ page: 1, size: 20 })
  const url = `/api/messages/${name}?types=${types}&page=${param.page}&size=${param.size}`
  const [{ error, data, page }, handler] = useData<Data[]>(url)

  const onChangePage = useCallback(
    (page: number, size: number = 20) => {
      setParam({ page, size })
      window.scroll(0, 0)
    },
    [setParam]
  )

  const onChangeType = useCallback(
    (checked: any[]) => {
      setTypes(checked.join(','))
      onChangePage(1)
    },
    [setTypes, onChangePage]
  )

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
          <Checkbox.Group onChange={onChangeType} options={options} value={types.split(',')} />
        </div>
      )}
      {page && (
        <div style={{ marginBottom: 10 }}>
          <CustomPagination page={page} onChange={onChangePage} />
        </div>
      )}
      {data && <Table cols={cols} rows={data} trClass={trClass} />}
      {page && <CustomPagination page={page} onChange={onChangePage} />}
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
    debug: t.type === 'DEBUG',
    info: t.type === 'NOTIFY',
    success: t.type === 'SUCCESS',
    warning: t.type === 'WARNING',
    danger: t.type === 'ERROR',
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
