import React from 'react'
import { Link } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'

import { User } from '../../../@version/token'
import { useData } from '../../../hooks/useData'
import { formatTime } from '../../../funcs/format'
import { StateRender } from '../../../comps/StateRender'
import { Column, Table } from '../../../comps/@table/Table'
import './Users.scss'

export default function Users() {

  const [state, handler] = useData<User[]>(`/api/users`)

  return (
    <StateRender
      title="用户管理"
      className="Users"
      state={state}
      handler={handler}
      render={data => (
        <Table rows={data} cols={getColumns()} />
      )}
    />
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
      key: 'createOn',
      title: '注册时间',
      format: (t) => formatCreateOn(t)
    },
    {
      key: 'loggedOn',
      title: '最后登入',
      format: (t) => formatLoggedOn(t),
      tdClass: (t) => justLogged(t) ? 'info' : ''
    },
    {
      key: 'command',
      title: '操作',
      format: formatCommand
    }
  ]
}

function formatCreateOn(t: User) {
  return formatTime(t.loggedOn)
}

function formatLoggedOn(t: User) {
  return formatTime(t.loggedOn)
}

function justLogged(t: User) {
  if (!t.loggedOn) return false
  return Date.now() - t.loggedOn < 2 * 86400 * 1000
}

function formatCommand(t: User) {
  return <Link to={`/users/${t.id}`}><EditOutlined /></Link>
}
