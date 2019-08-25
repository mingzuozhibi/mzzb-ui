import React, { useMemo } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert, Button } from 'antd'
import { Edit as EditIcon } from '@ant-design/icons'

import { useData } from '../../../hooks/useData'
import { useWidth, useTitle } from '../../../hooks/hooks'
import { Column, Table } from '../../../comps/@table/Table'
import { User } from '../user'
import './Users.scss'

export default function Users({history}: RouteComponentProps<void>) {

  useTitle('用户管理')

  const [{error, data}, handler] = useData<User[]>(`/api/users`)

  const width = useWidth('.Users')
  const cols = useMemo(() => getColumns(width), [width])
  const addUserButton = (
    <span className="table-buttons">
      <Button.Group>
        <Button onClick={() => history.push(`/users/add`)}>添加用户</Button>
      </Button.Group>
    </span>
  )

  return (
    <div className="Users">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table rows={data} cols={cols} title="用户管理" handler={handler} extraCaption={addUserButton}/>
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
  return <Link to={`/users/${t.id}`}><EditIcon/></Link>
}
