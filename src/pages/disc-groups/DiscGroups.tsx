import { useAppSelector } from '#A/hooks'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useLocal } from '#H/useLocal'
import { useOnceRequest } from '#H/useOnce'
import { thenCompare } from '#U/compare'
import { isJustUpdate } from '#U/date/check'
import { formatTimeout } from '#U/date/timeout'
import { testWarpper } from '#U/domain'
import { fetchResult } from '#U/fetch/fetchResult'
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './DiscGroups.scss'

import { linkToGroup, linkToGroupEditList, linkToGroupViewList } from '#A/links'
import { viewTypes } from '#A/metas'
import { IGroupCount } from '#T/disc'

const adminCols = buildColumns()
const guestCols = adminCols.filter((col) => !['edit', 'item'].includes(col.key))

const defaultSort = compareDiscGroups()

export default function DiscGroups() {
  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const [isEditMode, setEditMode] = useLocal('local-editmode', false)

  const showExtraButtons = hasBasic
  const showExtraColumns = hasBasic && isEditMode
  const fetchPrivateData = hasBasic && isEditMode

  const url = fetchPrivateData ? '/api/discGroups?hasPrivate=true' : '/api/discGroups'
  const { data: groups, ...state } = useOnceRequest(
    () => fetchResult<IGroupCount[]>(url).then((result) => result.data),
    { refreshDeps: [url] }
  )

  const navigate = useNavigate()
  const lastButtons = testWarpper(showExtraButtons, () =>
    isEditMode ? (
      <Button.Group key="1">
        <Button onClick={() => setEditMode(false)}>浏览模式</Button>
        <Button onClick={() => navigate('/disc_groups/add')}>添加列表</Button>
      </Button.Group>
    ) : (
      <Button.Group key="2">
        <Button onClick={() => setEditMode(true)}>管理模式</Button>
      </Button.Group>
    )
  )

  return (
    <div className="DiscGroups" style={{ maxWidth: 650 }}>
      <MzTopbar title="推荐列表" state={state} extra={[lastButtons]} />
      {groups && (
        <MzTable
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

function trClass(t: IGroupCount) {
  return { warning: t.viewType === 'PrivateList' }
}

function buildColumns(): MzColumn<IGroupCount>[] {
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
        let color = isJustUpdate(row.modifyTime, 1) ? 'red' : '#C67532'
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
  return thenCompare<IGroupCount>(
    (a, b) => sorts.indexOf(a.viewType) - sorts.indexOf(b.viewType),
    (a, b) => b.key.localeCompare(a.key)
  )
}
