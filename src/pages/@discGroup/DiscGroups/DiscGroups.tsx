import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './DiscGroups.scss'

import { linkToGroup, linkToGroupViewList } from '#A/links'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useData } from '#H/useData'
import { useLocal } from '#H/useLocal'
import { useTitle } from '#H/useTitle'
import { IGroup } from '#T/disc'
import { viewTypes } from '#T/meta'
import { composeCompares } from '#U/compare'
import { isJustUpdated } from '#U/domain'
import { formatTimeout } from '#U/format'
import { useAppSelector } from '#A/hooks'

const adminCols = getColumns()
const guestCols = adminCols.filter((col) => !['edit', 'item'].includes(col.key))

const defaultSort = compareDiscGroups()

export default function DiscGroups() {
  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const [isAdminMode, setAdminMode] = useLocal('local-isadmin', false)

  const showExtraButtons = hasBasic
  const showExtraColumns = hasBasic && isAdminMode
  const fetchPrivateData = hasBasic && isAdminMode

  const url = fetchPrivateData ? '/api/discGroups?hasPrivate=true' : '/api/discGroups'
  const [{ error, data }, handler] = useData<IGroup[]>(url)

  const navigate = useNavigate()
  const extraButtons = isAdminMode ? (
    <Button.Group>
      <Button onClick={() => setAdminMode(false)}>浏览模式</Button>
      <Button onClick={() => navigate('/disc_groups/add')}>添加列表</Button>
    </Button.Group>
  ) : (
    <Button.Group>
      <Button onClick={() => setAdminMode(true)}>管理模式</Button>
    </Button.Group>
  )

  useTitle('推荐列表')

  return (
    <div className="DiscGroups">
      {error && <Alert message={error} type="error" />}
      {data && (
        <MzTable
          rows={data}
          cols={showExtraColumns ? adminCols : guestCols}
          title="推荐列表"
          trClass={trClass}
          handler={handler}
          defaultSort={defaultSort}
          extraCaption={showExtraButtons && extraButtons}
        />
      )}
    </div>
  )
}

function trClass(t: IGroup) {
  return { warning: t.viewType === 'PrivateList' }
}

function getColumns(): MzColumn<IGroup>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'title',
      title: '列表标题',
      format: formatLinkedTitle,
    },
    {
      key: 'update',
      title: '最后更新',
      format: formatLastUpdate,
    },
    {
      key: 'edit',
      title: '编辑列表',
      format: formatEdit,
    },
    {
      key: 'item',
      title: '增减碟片',
      format: formatItem,
    },
  ]
}

function formatLinkedTitle(row: IGroup) {
  let color = isJustUpdated(row.modifyTime) ? 'red' : '#C67532'
  return (
    <>
      <Link to={linkToGroupViewList(row.key)}>{row.title}</Link>
      <span style={{ color, marginLeft: 8 }}>({row.discCount})</span>
    </>
  )
}

function formatLastUpdate(row: IGroup) {
  if (!row.enabled || !row.modifyTime) return '停止更新'
  return formatTimeout(row.modifyTime)
}

function formatEdit(row: IGroup) {
  return (
    <Link to={linkToGroup(row.key)}>
      <EditOutlined />
    </Link>
  )
}

function formatItem(row: IGroup) {
  return (
    <Link to={linkToGroupViewList(row.key)}>
      <UnorderedListOutlined />
    </Link>
  )
}

function compareDiscGroups() {
  const sorts = viewTypes.map((e) => e.value)
  return composeCompares<IGroup>([
    (a, b) => sorts.indexOf(a.viewType) - sorts.indexOf(b.viewType),
    (a, b) => b.key.localeCompare(a.key),
  ])
}
