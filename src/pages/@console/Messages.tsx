import { MzCheckbox } from '##/comps/checkbox/MzCheckbox'
import { MzDate } from '##/comps/date/MzDate'
import { MzLink } from '##/comps/link/MzLink'
import { MzPagination } from '##/comps/pagination/MzPagination'
import { MzColumn, MzTable } from '##/comps/table/MzTable'
import { useData } from '##/hooks'
import { UrlBuilder } from '##/utils/urlBuilder'
import { Alert, Button, CheckboxOptionType, Input } from 'antd'
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
  const [query, setQuery] = useState('')

  const url = new UrlBuilder(`/api/messages/${name}`)
    .append('types', types.join(','))
    .append('page', `${param.page}`)
    .append('size', `${param.size}`)
    .append('search', query)
    .toString()

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

  function onSearch(value: string) {
    setQuery(value)
    setParam({ page: 1, size: param.size })
  }

  return (
    <div className="Messages">
      {error && <Alert message={error} type="error" />}
      {msgs && (
        <>
          <div className="format">
            <span className="more">
              <Button children={'刷新'} onClick={handler.refresh} loading={handler.loading} />
            </span>
            <MzCheckbox options={options} value={types} onChange={onChangeTypes} />
          </div>
          <div className="format">
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            />
          </div>
        </>
      )}
      {page && (
        <div className="format">
          <MzPagination page={page} onChange={onChangePage} />
        </div>
      )}
      {msgs && <MzTable cols={cols} rows={msgs} trClass={trClass} />}
      {page && (
        <div className="format">
          <MzPagination page={page} onChange={onChangePage} />
        </div>
      )}
    </div>
  )
}

function getCols(): MzColumn<IMsg>[] {
  return [
    {
      key: 'time',
      title: '时间',
      format: (t) => <MzDate time={t.createOn} />,
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
        <MzLink href={`/discs/asin/${result[1]}`} title={result[1]} />
        {t.text.slice(result.index + 11)}
      </>
    )
  } else {
    return t.text
  }
}
