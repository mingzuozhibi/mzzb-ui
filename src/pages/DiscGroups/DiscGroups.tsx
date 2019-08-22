import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert, Button, Icon } from 'antd'

import { useData } from '../../hooks/useData'
import { useDocumentTitle } from '../../hooks/hooks'
import { Column, Table } from '../../comps/table/Table'
import { isJustUpdated } from '../../funcs/domain'
import { formatTimeout } from '../../funcs/format'
import { composeCompares } from '../../funcs/compare'

import './DiscGroups.scss'

export interface DiscGroup {
  id: number
  key: string
  title: string
  enabled: boolean
  viewType: string
  discsSize: number
  modifyTime: number
}

export const viewTypes = [
  {label: '日亚实时', value: 'SakuraList'},
  {label: '公开列表', value: 'PublicList'},
  {label: '私有列表', value: 'PrivateList'},
]

interface Props {
  hasRole: boolean
  isAdminMode: boolean
  setAdminMode: (isAdminMode: boolean) => void
}

const cols = getColumns()
const sort = compareDiscGroups()

export function DiscGroups(props: Props & RouteComponentProps<void>) {

  const {hasRole, isAdminMode, setAdminMode, history} = props

  useDocumentTitle('推荐列表')

  const url = isAdminMode ? '/api/sakuras?public=false' : '/api/sakuras'
  const [{error, data}, handler] = useData<DiscGroup[]>(url)

  const finalCols = cols.filter(col => isAdminMode || !['edit', 'item'].includes(col.key))

  const extraButtons = hasRole && (
    <>
      <span className="table-buttons">
        {isAdminMode ? (
          <Button.Group>
            <Button onClick={() => setAdminMode(false)}>浏览模式</Button>
            <Button onClick={() => history.push('/disc_groups/add')}>添加列表</Button>
          </Button.Group>
        ) : (
          <Button.Group>
            <Button onClick={() => setAdminMode(true)}>管理模式</Button>
          </Button.Group>
        )}
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
               trClass={trClass} defaultSort={sort} extraCaption={extraButtons}/>
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
      <span style={{color, marginLeft: 8}}>({row.discsSize})</span>
    </>
  )
}

function formatLastUpdate(row: DiscGroup) {
  if (!row.modifyTime) return '停止更新'
  return `${formatTimeout(row.modifyTime)}前`
}

function formatEdit(t: DiscGroup) {
  return <Link to={`/disc_groups/${t.key}`}><Icon type="edit"/></Link>
}

function formatItem(t: DiscGroup) {
  return <Link to={``}><Icon type="unordered-list"/></Link>
}

const viewTpyes = ['SakuraList', 'PublicList', 'PrivateList']

function compareDiscGroups() {
  return composeCompares<DiscGroup>([
    (a, b) => viewTpyes.indexOf(a.viewType) - viewTpyes.indexOf(b.viewType),
    (a, b) => b.key.localeCompare(a.key),
  ])
}
