import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Button, Icon } from 'antd'

import { RootState } from '../../reducers'
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
  hasRole: boolean
}

const cols = getColumns()

export default connect((state: RootState) => ({
  hasRole: state.session.userRoles.includes('ROLE_BASIC')
}))(DiscGroups)

function DiscGroups({hasRole}: Props) {

  useDocumentTitle('推荐列表')

  const [{data, error}, handler] = useData<DiscGroup[]>(`/api/sakuras`)

  const finalCols = cols.filter(col => hasRole || !['edit', 'item'].includes(col.key))

  const addUserButton = (
    <>
      <span className="table-buttons">
        <Button.Group>
          <Button>添加列表</Button>
        </Button.Group>
      </span>
      <span className="table-buttons">
        <Button.Group>
          <Button>显示所有</Button>
        </Button.Group>
      </span>
    </>
  )

  return (
    <div className="DiscGroups">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table rows={data} cols={finalCols} title="推荐列表" handler={handler}
               defaultSort={(a, b) => b.key.localeCompare(a.key)} extraCaption={addUserButton}/>
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
      key: 'update',
      title: '最后更新',
      format: formatLastUpdate
    },
    {
      key: 'edit',
      title: '编辑信息',
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
      <span style={{color, marginLeft: 8}}>({row.discsSize})</span>
    </>
  )
}

function formatLastUpdate(row: DiscGroup) {
  if (!row.modifyTime) return '停止更新'
  return `${formatTimeout(row.modifyTime)}前`
}

function formatEdit(t: DiscGroup) {
  return <Link to={``}><Icon type="edit"/></Link>
}

function formatItem(t: DiscGroup) {
  return <Link to={``}><Icon type="unordered-list"/></Link>
}
