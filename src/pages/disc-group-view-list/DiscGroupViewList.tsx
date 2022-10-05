import { useAppSelector } from '#A/hooks'
import { MzHeader } from '#C/header/MzHeader'
import { AllColumns } from '#C/warpper/AllColumns'
import { useLocal } from '#H/useLocal'
import { useData } from '#H/useOnce'
import { safeWarpper } from '#U/domain'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Select, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { apiToGroups, linkToGroups } from '#A/links'
import { IDisc, IGroupDiscs } from '#T/disc'
import { formatTimeout } from '#U/date/timeout'

import { DiscTable } from '../@disc-table/disc-table'
import { DiscTableCompact } from '../@disc-table/disc-table-compact'

type ViewMode = 'all' | 'auto' | 'compact'

export default function DiscGroupViewList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string
  const localKey = groupKey.replaceAll('-', '').toLocaleLowerCase()

  const [viewMode, setViewMode] = useLocal<ViewMode>(`viewlist-viewmode`, 'auto')
  const [editMode, setEditMode] = useLocal<boolean>(`viewlist-editmode`, false)
  const [findMode, setFindMode] = useLocal<boolean>(`viewlist-findmode-${localKey}`, false)
  const [findText, setFindText] = useLocal<string>(`viewlist-findtext-${localKey}`, '')

  const apiUrl = apiToGroups(`/key/${groupKey}/discs`)
  const { data: group, ...state } = useData<IGroupDiscs>(apiUrl)
  const lastRows = sortRows(group?.discs, findText.trim(), findMode)

  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const navigate = useNavigate()
  const maxWidth = viewMode === 'all' ? '100%' : '800px'

  return (
    <div className="DiscGroupViewList" style={{ maxWidth }}>
      <MzHeader
        title={group?.title}
        state={state}
        subTitle={safeWarpper(group?.modifyTime, (updateOn) => (
          <span>更新于{formatTimeout(updateOn)}</span>
        ))}
        items={[
          {
            key: 'K1',
            label: findMode ? '关闭过滤' : '开启过滤',
            onClick: () => setFindMode(!findMode),
          },
          {
            key: 'K2',
            label: editMode ? '中文标题' : '日文标题',
            onClick: () => setEditMode(!editMode),
          },
          {
            key: 'K3',
            label: '编辑列表',
            onClick: () => navigate(linkToGroups(`/${groupKey}`)),
            disabled: !hasBasic,
          },
          {
            key: 'K4',
            label: '管理碟片',
            onClick: () => navigate(linkToGroups(`/${groupKey}/discs/edit`)),
            disabled: !hasBasic,
          },
        ]}
        extra={[
          <Select key="K1" value={viewMode} onChange={setViewMode}>
            <Select.Option value="all">所有列</Select.Option>
            <Select.Option value="auto">智能列</Select.Option>
            <Select.Option value="compact">紧凑列</Select.Option>
          </Select>,
        ]}
      />
      <Space direction="vertical">
        {findMode && (
          <Input.Search
            placeholder="查询日文或中文标题"
            allowClear
            enterButton="Search"
            prefix={<SearchOutlined />}
            size="large"
            onSearch={setFindText}
            defaultValue={findText}
          />
        )}
        {safeWarpper(lastRows, (lastRows) =>
          viewMode === 'compact' ? (
            <DiscTableCompact name={localKey} rows={lastRows!} showJapan={editMode} />
          ) : (
            <AllColumns viewMode={viewMode}>
              <DiscTable name={localKey} rows={lastRows!} showJapan={editMode} />
            </AllColumns>
          )
        )}
      </Space>
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
