import { useData } from '##/hooks'
import { Column, Table } from '#C/@table/Table'
import { CustomCheckbox } from '#C/CustomCheckbox'
import { CustomDate } from '#C/CustomDate'
import { CustomLink } from '#C/CustomLink'
import { CustomPagination } from '#C/CustomPagination'
import { Alert, Button, CheckboxOptionType } from 'antd'
import { useEffect, useState } from 'react'
import './Messages.scss'

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

const options: CheckboxOptionType[] = [
  { label: '调试', value: 'DEBUG' },
  { label: '信息', value: 'INFO' },
  { label: '通知', value: 'NOTIFY' },
  { label: '成功', value: 'SUCCESS' },
  { label: '警告', value: 'WARNING' },
  { label: '错误', value: 'ERROR' },
]

const defaultTypes = options.map((e) => e.value)
const cols = getCols()

export default function Messages({ name, activeKey }: Props) {
  const [types, setTypes] = useState(defaultTypes)
  const [param, setParam] = useState({ page: 1, size: 20 })
  const url = `/api/messages/${name}?types=${types.join(',')}&page=${param.page}&size=${param.size}`
  const [{ error, data: msgs, page }, handler] = useData<IMsg[]>(url)

  useEffect(() => {
    if (activeKey === name && !handler.loading) {
      handler.refresh()
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

  return (
    <div className="Messages">
      {error && <Alert message={error} type="error" />}
      {msgs && (
        <div className="format">
          <span className="more">
            <Button children={'刷新'} onClick={handler.refresh} loading={handler.loading} />
          </span>
          <CustomCheckbox options={options} value={types} onChange={onChangeTypes} />
        </div>
      )}
      {page && (
        <div className="format">
          <CustomPagination page={page} onChange={onChangePage} />
        </div>
      )}
      {msgs && <Table cols={cols} rows={msgs} trClass={trClass} />}
      {page && (
        <div className="format">
          <CustomPagination page={page} onChange={onChangePage} />
        </div>
      )}
    </div>
  )
}

function getCols(): Column<IMsg>[] {
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

function trClass(t: IMsg) {
  return {
    debug: t.type === 'DEBUG',
    info: t.type === 'NOTIFY',
    success: t.type === 'SUCCESS',
    warning: t.type === 'WARNING',
    danger: t.type === 'ERROR',
  }
}

const re = /[\(\[]([A-Z0-9]{10})[\)\]]/

function formatText(t: IMsg) {
  const result = re.exec(t.text)
  if (result) {
    return (
      <>
        {t.text.slice(0, result.index + 1)}
        <CustomLink href={`/discs/asin/${result[1]}`} title={result[1]} />
        {t.text.slice(result.index + 11)}
      </>
    )
  } else {
    return t.text
  }
}
