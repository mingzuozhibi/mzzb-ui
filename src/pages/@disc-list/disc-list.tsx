import { RefreshButton } from '#C/button/Refresh'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocal } from '#H/useLocal'
import { formatTimeout } from '#U/date/timeout'
import { safeWarpper } from '#U/domain'
import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Menu, Select, Space } from 'antd'
import classNames from 'classnames'
import './disc-list.scss'

import { IDisc } from '#T/disc'
import { IState } from '#T/result'
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
  const [editMode, setEditMode] = useLocal<boolean>(`local-disclist-editmode`, false)
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
    <RefreshButton key="K1" state={state} />,
    <Select key="K2" defaultValue={viewMode} style={{ width: 90 }} onChange={setViewMode}>
      <Select.Option value="all">所有列</Select.Option>
      <Select.Option value="auto">智能列</Select.Option>
      <Select.Option value="compact">紧凑型</Select.Option>
    </Select>,
    <Dropdown
      key="K3"
      overlay={
        <Menu
          items={[
            {
              key: 'M1',
              label: findMode ? '查询关' : '查询开',
              onClick: () => setFindMode(!findMode),
            },
            {
              key: 'M2',
              label: editMode ? '日语关' : '日语开',
              onClick: () => setEditMode(!editMode),
            },
          ]}
        />
      }
    >
      <Button>
        <Space>
          功能
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>,
  ]

  buttons?.forEach((button) => lastButtons.push(button))

  const pcModeCls = { 'pc-mode': viewMode === 'all' }

  return (
    <div className={classNames('disc-list', pcModeCls)}>
      <MzTopbar
        title={title}
        error={state.error?.message}
        subTitle={safeWarpper(updateOn, (updateOn) => (
          <span>更新于{formatTimeout(updateOn)}</span>
        ))}
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
      {safeWarpper(lastRows, (lastRows) =>
        viewMode === 'compact' ? (
          <DiscListTableMo name={name} rows={lastRows!} showJapan={editMode} />
        ) : (
          <div className="pc-mode-warpper">
            <div className={classNames(pcModeCls)}>
              <DiscListTable name={name} rows={lastRows!} showJapan={editMode} />
            </div>
          </div>
        )
      )}
    </div>
  )
}
