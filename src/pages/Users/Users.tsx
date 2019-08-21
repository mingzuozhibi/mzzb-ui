import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Icon } from 'antd'
import { useData } from '../../hooks/useData'
import { useDocumentTitle, useClientWidth } from '../../hooks/hooks'
import { Column, Table } from '../../comps/table/Table'
import './Users.scss'

export interface User {
  id: number
  enabled: boolean
  username: string
  registerDate: string
  lastLoggedIn: string
}

export default function Users() {

  useDocumentTitle('用户管理')

  const [{error, data}, handler] = useData<User[]>(`/api/users`)

  const width = useClientWidth('.Users')
  const cols = useMemo(() => getColumns(width), [width])

  return (
    <div className="Users">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table rows={data} cols={cols} title="用户管理" handler={handler}/>
      )}
    </div>
  )
}

function getColumns(width: number): Column<User>[] {
  return [
    {
      key: 'id',
      title: 'ID',
      format: (t) => t.id
    },
    {
      key: 'username',
      title: `用户名`,
      format: (t) => t.username
    },
    {
      key: 'enabled',
      title: '启用',
      format: (t) => t.enabled ? '是' : '--'
    },
    {
      key: 'registerDate',
      title: '注册时间',
      format: (t) => formatRegisterDate(t, width)
    },
    {
      key: 'lastLoggedIn',
      title: '最后登入',
      format: (t) => formatLastLoggedIn(t, width),
      tdClass: (t) => justLogged(t) ? 'info' : ''
    },
    {
      key: 'command',
      title: '操作',
      format: formatCommand
    }
  ]
}

function formatRegisterDate(t: User, width: number) {
  const text = t.registerDate
  return width <= 500 ? text.substr(0, 10) : text
}

function formatLastLoggedIn(t: User, width: number) {
  const text = t.lastLoggedIn
  if (!text) return '从未登入'
  return width <= 500 ? text.substr(5, 11) : text
}

function justLogged(t: User) {
  if (!t.lastLoggedIn) return false
  const time = new Date(t.lastLoggedIn).getTime()
  return Date.now() - time < 2 * 86400 * 1000
}

function formatCommand(t: User) {
  return <Link to={`/admin/user/${t.id}`}><Icon type="edit"/></Link>
}
