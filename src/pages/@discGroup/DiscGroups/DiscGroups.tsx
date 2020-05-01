import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'antd'
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'

import { useData } from '../../../hooks/useData'
import { useTitle } from '../../../hooks/hooks'
import { Column, Table } from '../../../comps/@table/Table'
import { isJustUpdated } from '../../../funcs/domain'
import { formatTimeout } from '../../../funcs/format'
import { composeCompares } from '../../../funcs/compare'

import { InjectAdminMode, injectAdminMode, InjectRole, injectRole } from '../../@inject'
import { DiscGroup, RouteProps } from '../../@types'
import './DiscGroups.scss'

const adminCols = getColumns()
const guestCols = adminCols.filter(col => !['edit', 'item'].includes(col.key))

const defaultSort = compareDiscGroups()

export default injectRole(injectAdminMode(DiscGroups))

function DiscGroups(props: InjectRole & InjectAdminMode & RouteProps<void>) {

  const { isDiscAdmin, isAdminMode, setAdminMode, history } = props

  const showExtraButtons = isDiscAdmin
  const showExtraColumns = isDiscAdmin && isAdminMode
  const fetchPrivateData = isDiscAdmin && isAdminMode

  const url = fetchPrivateData ? '/api/groups' : '/api/groups/find/status/Current'
  const [{ error, data }, handler] = useData<DiscGroup[]>(url)

  const extraButtons = isAdminMode ?
    (
      <Button.Group>
        <Button onClick={() => setAdminMode(false)}>浏览模式</Button>
        <Button onClick={() => history.push('/disc_groups/add')}>添加列表</Button>
      </Button.Group>
    ) : (
      <Button.Group>
        <Button onClick={() => setAdminMode(true)}>管理模式</Button>
      </Button.Group>
    )

  useTitle('推荐列表')

  return (
    <div className="DiscGroups">
      {error && (
        <Alert message={error} type="error" />
      )}
      {data && (
        <Table
          rows={data}
          cols={showExtraColumns ? adminCols : guestCols}
          title="推荐列表"
          handler={handler}
          defaultSort={defaultSort}
          extraCaption={showExtraButtons && extraButtons}
        />
      )}
    </div>
  )
}

function getColumns(): Column<DiscGroup>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (_, idx) => idx + 1
    },
    {
      key: 'title',
      title: '列表标题',
      format: formatLinkedTitle
    },
    {
      key: 'status_type',
      title: '类型',
      format: t => t.status
    },
    {
      key: 'update_type',
      title: '更新',
      format: t => t.update
    },
    {
      key: 'last_update',
      title: '最后更新',
      format: formatLastUpdate
    },
    {
      key: 'edit',
      title: '编辑列表',
      format: formatEdit
    },
    {
      key: 'item',
      title: '增减碟片',
      format: formatItem
    }
  ]
}

function formatLinkedTitle(row: DiscGroup) {
  let color = isJustUpdated(row.lastUpdate) ? 'red' : '#C67532'
  return (
    <>
      <Link to={`/discs/disc_groups/${row.index}`}>{row.title}</Link>
      <span style={{ color, marginLeft: 8 }}>({row.discCount})</span>
    </>
  )
}

function formatLastUpdate(row: DiscGroup) {
  if (!row.lastUpdate) return '停止更新'
  return `${formatTimeout(row.lastUpdate)}前`
}

function formatEdit(t: DiscGroup) {
  return <Link to={`/disc_groups/${t.index}`}><EditOutlined /></Link>
}

function formatItem(t: DiscGroup) {
  return <Link to={`/disc_groups/${t.index}/discs`}><UnorderedListOutlined /></Link>
}

function compareDiscGroups() {
  return composeCompares<DiscGroup>([
    (a, b) => a.status.localeCompare(b.status),
    (a, b) => a.update.localeCompare(b.update),
    (a, b) => b.index.localeCompare(a.index)
  ])
}
