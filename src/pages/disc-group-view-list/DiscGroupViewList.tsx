import { useAppSelector } from '#A/hooks'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocal } from '#H/useLocal'
import { useOnceRequest } from '#H/useOnce'
import { safeWarpper, testWarpper } from '#U/domain'
import { fetchResult } from '#U/fetch/fetchResult'
import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Menu, Select, Space } from 'antd'
import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import './DiscGroupViewList.scss'

import { linkToGroup, linkToGroupEditList } from '#A/links'
import { IDisc, IGroupDiscs } from '#T/disc'
import { formatTimeout } from '#U/date/timeout'
import { DiscTable } from '../@disc-table/disc-table'
import { DiscTableCompact } from '../@disc-table/disc-table-compact'

type ViewMode = 'all' | 'auto' | 'compact'

export default function DiscGroupViewList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string
  const localKey = groupKey.replaceAll('-', '').toLocaleLowerCase()

  const [viewMode, setViewMode] = useLocal<ViewMode>(`local-disclist-viewmode`, 'auto')
  const [editMode, setEditMode] = useLocal<boolean>(`local-disclist-editmode`, false)
  const [findMode, setFindMode] = useLocal<boolean>(`local-disclist-findmode-${localKey}`, false)
  const [findText, setFindText] = useLocal<string>(`local-disclist-findtext-${localKey}`, '')

  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupDiscs>(`/api/discGroups/key/${groupKey}/discs`).then((result) => result.data)
  )

  let lastRows = sortRows(group?.discs, findText, findMode)

  const items = [
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
  ]

  const navigate = useNavigate()
  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const buttons = [
    <Select key="K1" value={viewMode} onChange={setViewMode}>
      <Select.Option value="all">所有列</Select.Option>
      <Select.Option value="auto">智能列</Select.Option>
      <Select.Option value="compact">紧凑型</Select.Option>
    </Select>,
    <Dropdown key="K2" overlay={<Menu items={items} />}>
      <Button>
        <Space>
          功能
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>,
    testWarpper(hasBasic, () => (
      <Button.Group key="K3">
        <Button onClick={() => navigate(linkToGroup(groupKey))}>编辑</Button>
        <Button onClick={() => navigate(linkToGroupEditList(groupKey))}>管理</Button>
      </Button.Group>
    )),
  ]

  const pcModeCls = { 'pc-mode': viewMode === 'all' }

  return (
    <div className="DiscGroupViewList">
      <div className={classNames(pcModeCls)}>
        <MzTopbar
          title={group?.title}
          state={state}
          subTitle={safeWarpper(group?.modifyTime, (updateOn) => (
            <span>更新于{formatTimeout(updateOn)}</span>
          ))}
          extra={buttons}
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
            <DiscTableCompact name={localKey} rows={lastRows!} showJapan={editMode} />
          ) : (
            <div className="pc-mode-warpper">
              <div className={classNames(pcModeCls)}>
                <DiscTable name={localKey} rows={lastRows!} showJapan={editMode} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
function sortRows(rows: IDisc[] | undefined, findText: string, findMode: boolean) {
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
  return lastRows
}
