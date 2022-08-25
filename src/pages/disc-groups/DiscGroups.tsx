import { useAppSelector } from '#A/hooks'
import { RefreshButton } from '#C/button/Refresh'
import { MyColumn, MyTable } from '#C/table/MyTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocal } from '#H/useLocal'
import { thenCompare } from '#U/compare'
import { isJustUpdated } from '#U/domain'
import { fetchResult } from '#U/fetchResult'
import { formatTimeout } from '#U/format'
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './DiscGroups.scss'

import { linkToGroup, linkToGroupEditList, linkToGroupViewList } from '#A/links'
import { viewTypes } from '#A/metas'
import { useOnceRequest } from '#H/useOnce'
import { IGroup } from '#T/disc'

const adminCols = buildColumns()
const guestCols = adminCols.filter((col) => !['edit', 'item'].includes(col.key))

const defaultSort = compareDiscGroups()

export default function DiscGroups() {
  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const [isAdminMode, setAdminMode] = useLocal('local-isadmin', false)

  const showExtraButtons = hasBasic
  const showExtraColumns = hasBasic && isAdminMode
  const fetchPrivateData = hasBasic && isAdminMode

  const url = fetchPrivateData ? '/api/discGroups?hasPrivate=true' : '/api/discGroups'
  const { data: groups, ...state } = useOnceRequest(
    () => fetchResult<IGroup[]>(url).then((result) => result.data),
    { refreshDeps: [url] }
  )

  const navigate = useNavigate()
  const button = <RefreshButton key="1" state={state} />
  const button2 = isAdminMode ? (
    <Button.Group key="2">
      <Button onClick={() => setAdminMode(false)}>浏览模式</Button>
      <Button onClick={() => navigate('/disc_groups/add')}>添加列表</Button>
    </Button.Group>
  ) : (
    <Button.Group key="3">
      <Button onClick={() => setAdminMode(true)}>管理模式</Button>
    </Button.Group>
  )

  const lastButtons = showExtraButtons ? [button, button2] : [button]

  return (
    <div className="DiscGroups">
      <MzTopbar title="推荐列表" error={state.error?.message} extra={lastButtons} />
      {groups && (
        <MyTable
          tag="groups"
          rows={groups}
          cols={showExtraColumns ? adminCols : guestCols}
          trClass={trClass}
          defaultSort={defaultSort}
        />
      )}
    </div>
  )
}

function trClass(t: IGroup) {
  return { warning: t.viewType === 'PrivateList' }
}

function buildColumns(): MyColumn<IGroup>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'title',
      title: '列表标题',
      format: (row) => {
        let color = isJustUpdated(row.modifyTime) ? 'red' : '#C67532'
        return (
          <span>
            <Link to={linkToGroupViewList(row.key)}>{row.title}</Link>
            <span style={{ color, marginLeft: 8 }}>({row.discCount})</span>
          </span>
        )
      },
    },
    {
      key: 'update',
      title: '最后更新',
      format: (row) => {
        if (!row.enabled || !row.modifyTime) return '停止更新'
        return formatTimeout(row.modifyTime)
      },
    },
    {
      key: 'edit',
      title: '编辑列表',
      format: (row) => {
        return (
          <Link to={linkToGroup(row.key)}>
            <EditOutlined />
          </Link>
        )
      },
    },
    {
      key: 'item',
      title: '增减碟片',
      format: (row) => {
        return (
          <Link to={linkToGroupEditList(row.key)}>
            <UnorderedListOutlined />
          </Link>
        )
      },
    },
  ]
}

function compareDiscGroups() {
  const sorts = viewTypes.map((e) => e.value)
  return thenCompare<IGroup>(
    (a, b) => sorts.indexOf(a.viewType) - sorts.indexOf(b.viewType),
    (a, b) => b.key.localeCompare(a.key)
  )
}
