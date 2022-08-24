import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Dropdown, Empty, Input, Menu, Select, Space } from 'antd'
import classNames from 'classnames'
import './disc-list.scss'

import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocal } from '#H/useLocal'
import { IDisc } from '#T/disc'
import { IState } from '#T/result'
import { formatTimeout } from '#U/format'

import { DiscListTable } from './disc-list-table'
import { DiscListTableMo } from './disc-list-table-mo'

interface Props {
  name: string
  rows?: IDisc[]
  state: IState
  title?: string
  buttons?: JSX.Element[]
  updateOn?: number
}

type ViewMode = 'all' | 'auto' | 'compact'

export function DiscList(props: Props) {
  const { rows, state, title, buttons, updateOn } = props
  const name = props.name.replaceAll('-', '').toLocaleLowerCase()

  const [viewMode, setViewMode] = useLocal<ViewMode>(`local-disclist-viewmode`, 'auto')
  const [findMode, setFindMode] = useLocal<boolean>(`local-disclist-findmode-${name}`, false)
  const [findText, setFindText] = useLocal<string>(`local-disclist-findtext-${name}`, '')

  let lastRows = rows
  if (findText.length > 0 && findMode === true && lastRows !== undefined) {
    for (const key of findText.split(' ')) {
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
    <Select key="K2" defaultValue={viewMode} style={{ width: 90 }} onChange={setViewMode}>
      <Select.Option value="all">所有列</Select.Option>
      <Select.Option value="auto">智能列</Select.Option>
      <Select.Option value="compact">紧凑型</Select.Option>
    </Select>,
    <Button key="K3" onClick={() => setFindMode(!findMode)}>
      {findMode ? '查询关' : '查询开'}
    </Button>,
  ]

  buttons?.forEach((button) => lastButtons.push(button))

  return (
    <div className="disc-list">
      <MzTopbar
        title={title}
        error={state.error?.message}
        subTitle={<span>更新于{formatTimeout(updateOn)}</span>}
        extra={lastButtons}
      />
      {findMode && (
        <Input.Search
          placeholder="查询日文或中文标题"
          allowClear
          enterButton="Search"
          prefix={<SearchOutlined />}
          size="large"
          onSearch={setFindText}
          defaultValue={findText}
          style={{ marginBottom: 8 }}
        />
      )}
      {lastRows === undefined ? (
        <Empty />
      ) : viewMode === 'compact' ? (
        <DiscListTableMo name={name} rows={lastRows!} />
      ) : (
        <div className="pc-mode-warpper">
          <div className={classNames({ 'pc-mode': viewMode === 'all' })}>
            <DiscListTable name={name} rows={lastRows!} />
          </div>
        </div>
      )}
    </div>
  )
}
