import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { useData } from '../../../../hooks/useData'
import { useTitle } from '../../../../hooks/hooks'
import { Column, Table } from '../../../../comps/@table/Table'
import { RouteProps } from '../../../../pages/@types'
import './Users.scss'

import { User } from '../../../token'
import { formatTime } from '../../../../funcs/format'

const cols = getColumns()

export default function Users({ history }: RouteProps<void>) {

  const [{ error, data }, handler] = useData<User[]>(`/api/users`)

  const addUserButton = (
    <Button.Group>
      <Button onClick={() => history.push(`/users/add`)}>添加用户</Button>
    </Button.Group>
  )

  useTitle('用户管理')

  return (
    <div className="Users">
      {error && (
        <Alert message={error} type="error" />
      )}
      {data && (
        <Table rows={data} cols={cols} title="用户管理" handler={handler} extraCaption={addUserButton} />
      )}
    </div>
  )
}

function getColumns(): Column<User>[] {
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
      format: (t) => formatRegisterDate(t)
    },
    {
      key: 'lastLoggedIn',
      title: '最后登入',
      format: (t) => formatLastLoggedIn(t),
      tdClass: (t) => justLogged(t) ? 'info' : ''
    },
    {
      key: 'command',
      title: '操作',
      format: formatCommand
    }
  ]
}

function formatRegisterDate(t: User) {
  return formatTime(t.loggedOn)
}

function formatLastLoggedIn(t: User) {
  return formatTime(t.loggedOn)
}

function justLogged(t: User) {
  if (!t.loggedOn) return false
  return Date.now() - t.loggedOn < 2 * 86400 * 1000
}

function formatCommand(t: User) {
  return <Link to={`/users/${t.id}`}><EditOutlined /></Link>
}
