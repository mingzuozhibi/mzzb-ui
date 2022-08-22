import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocal } from '#H/useLocal'
import { IDisc } from '#T/disc'
import { IState } from '#T/result'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { DiscListTable } from './disc-list-table'
import './disc-list.scss'

interface Props {
  name: string
  rows: IDisc[]
  state: IState
  title: string
  buttons?: JSX.Element[]
  updateOn?: number
}

export function DiscList(props: Props) {
  const { name, rows, state, title, buttons, updateOn } = props

  const [pcMode, setPcMode] = useLocal(`local-discs/${name}/pc-mode`, false)
  const [quMode, setQuMode] = useLocal(`local-discs/${name}/qu-mode`, false)
  const [query, setQuery] = useLocal(`local-discs/${name}/query`, '')

  let lastRows = rows
  if (query.length > 0 && quMode === true && lastRows !== undefined) {
    for (const key of query.split(' ')) {
      lastRows = lastRows.filter((d) => {
        if (d.title.includes(key)) return true
        if (d.titlePc?.includes(key)) return true
        return false
      })
    }
  }

  const lastButtons = [
    <Button key="K1" loading={state.loading} onClick={state.refresh}>
      刷新
    </Button>,
    <Button key="K2" onClick={() => setPcMode(!pcMode)}>
      {pcMode ? '默认列' : '所有列'}
    </Button>,
    <Button key="K3" onClick={() => setQuMode(!quMode)}>
      {quMode ? '查询关' : '查询开'}
    </Button>,
  ]

  buttons?.forEach((button) => lastButtons.push(button))

  return (
    <div className="disc-list">
      <MzTopbar
        title={title}
        error={state.error?.message}
        subTitle={updateOn && <span>更新于 {dayjs(updateOn).fromNow()}</span>}
        extra={lastButtons}
      />
      {quMode && (
        <Input.Search
          placeholder="查询日文或中文标题，可以使用空格"
          allowClear
          enterButton="Search"
          prefix={<SearchOutlined />}
          size="large"
          onSearch={setQuery}
          defaultValue={query}
          style={{ marginBottom: 8 }}
        />
      )}
      <div className="pc-mode-warpper">
        <div className={classNames({ 'pc-mode': pcMode })}>
          <DiscListTable name={name} rows={lastRows!} />
        </div>
      </div>
    </div>
  )
}
