import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Edit as EditIcon, UnorderedList } from '@ant-design/icons'
import { Alert, Button } from 'antd'

import { useData } from '../../../hooks/useData'
import { useTitle } from '../../../hooks/hooks'
import { Column, Table } from '../../../comps/@table/Table'
import { isJustUpdated } from '../../../funcs/domain'
import { formatTimeout } from '../../../funcs/format'
import { composeCompares } from '../../../funcs/compare'

import { InjectAdminMode, injectAdminMode, InjectRole, injectRole } from '../../@inject'
import { DiscGroup, viewTypes } from '../../@types'
import './DiscGroups.scss'

const adminCols = getColumns()
const guestCols = adminCols.filter(col => !['edit', 'item'].includes(col.key))

const defaultSort = compareDiscGroups()

export default injectRole(injectAdminMode(DiscGroups))

function DiscGroups(props: InjectRole & InjectAdminMode & RouteComponentProps<void>) {

  const {isBasic, isAdminMode, setAdminMode, history} = props

  const showExtraButtons = isBasic
  const showExtraColumns = isBasic && isAdminMode
  const fetchPrivateData = isBasic && isAdminMode

  const url = fetchPrivateData ? '/api/discGroups?hasPrivate=true' : '/api/discGroups'
  const [{error, data}, handler] = useData<DiscGroup[]>(url)

  const extraButtons = isAdminMode ? (
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
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table
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

function trClass(t: DiscGroup) {
  return {'warning': t.viewType === 'PrivateList'}
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
      key: 'update',
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
  let color = isJustUpdated(row.modifyTime) ? 'red' : '#C67532'
  return (
    <>
      <Link to={`/discs/disc_groups/${row.key}`}>{row.title}</Link>
      <span style={{color, marginLeft: 8}}>({row.discCount})</span>
    </>
  )
}

function formatLastUpdate(row: DiscGroup) {
  if (!row.modifyTime) return '停止更新'
  return `${formatTimeout(row.modifyTime)}前`
}

function formatEdit(t: DiscGroup) {
  return <Link to={`/disc_groups/${t.key}`}><EditIcon/></Link>
}

function formatItem(t: DiscGroup) {
  return <Link to={`/disc_groups/${t.key}/discs`}><UnorderedList/></Link>
}

function compareDiscGroups() {
  const sorts = viewTypes.map(e => e.value)
  return composeCompares<DiscGroup>([
    (a, b) => sorts.indexOf(a.viewType) - sorts.indexOf(b.viewType),
    (a, b) => b.key.localeCompare(a.key),
  ])
}
