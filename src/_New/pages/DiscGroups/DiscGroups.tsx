import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Icon } from 'antd'

import { RootState } from '../../../common/root-reducer'
import { useData } from '../../hooks/useData'
import { useDocumentTitle } from '../../hooks/hooks'
import { Column, Table } from '../../comps/table/Table'
import { isJustUpdated } from '../../funcs/domain'
import { formatTimeout } from '../../funcs/format'

import './DiscGroups.scss'

interface DiscGroup {
  id: number
  key: string
  title: string
  enabled: boolean
  viewType: string
  discsSize: number
  modifyTime: number
}

interface Props {
  userRoles: string[]
}

const cols = getColumns()

function DiscGroups(props: Props) {

  useDocumentTitle('推荐列表')

  const [{data, error}, handler] = useData<DiscGroup[]>(`/api/sakuras`)

  const hasRole = props.userRoles.includes('ROLE_BASIC')
  const finalCols = cols.filter(col => hasRole || col.key !== 'command')

  return (
    <div className="DiscGroups">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table rows={data} cols={finalCols} title="推荐列表" handler={handler}
               defaultSort={(a, b) => b.key.localeCompare(a.key)}/>
      )}
    </div>
  )
}

export default connect((state: RootState) => ({
  userRoles: state.app.session.userRoles
}))(DiscGroups)

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
      key: 'command',
      title: '操作',
      format: formatCommand
    }
  ]
}

function formatLinkedTitle(row: DiscGroup) {
  let color = isJustUpdated(row.modifyTime) ? 'red' : '#C67532'
  return (
    <>
      <Link to={`/discs/disc_groups/${row.key}`}>{row.title}</Link>
      <span style={{color, marginLeft: 8}}>({row.discsSize})</span>
    </>
  )
}

function formatLastUpdate(row: DiscGroup) {
  if (!row.modifyTime) return '停止更新'
  return `${formatTimeout(row.modifyTime)}前`
}

function formatCommand(t: DiscGroup) {
  return <Link to={`/admin/sakura/${t.key}`}><Icon type="edit"/></Link>
}
