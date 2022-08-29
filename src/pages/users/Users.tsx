import { MyColumn, MyTable } from '#C/table/MyTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useOnceRequest } from '#H/useOnce'
import { useWidth } from '#H/useWidth'
import { safeWarpper } from '#U/domain'
import { fetchResult } from '#U/fetch/fetchResult'
import { Button } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Users.scss'

import { IUser } from '#T/user'
import { isJustUpdate } from '#U/date/check'
import { formatDate, formatDateTime } from '#U/date/format'

const cols = buildColumns()

export default function Users() {
  const { data: users, ...state } = useOnceRequest(() =>
    fetchResult<IUser[]>(`/api/users`).then((result) => result.data)
  )

  const navigate = useNavigate()

  return (
    <div className="Users">
      <MzTopbar
        title="用户管理"
        state={state}
        extra={[
          <Button key="1" onClick={() => navigate(`/users/add`)}>
            添加用户
          </Button>,
        ]}
      />
      {safeWarpper(users, (users) => (
        <MyTable tag="users" rows={users} cols={cols} title="用户管理" />
      ))}
    </div>
  )
}

function buildColumns(): MyColumn<IUser>[] {
  return [
    {
      key: 'id',
      title: 'ID',
      format: (row) => row.id,
    },
    {
      key: 'username',
      title: `用户名`,
      format: (row) => formatUsername(row),
    },
    {
      key: 'enabled',
      title: '启用',
      format: (row) => formatEnabled(row),
    },
    {
      key: 'registerDate',
      title: '注册时间',
      format: (row) => formatRegisterDate(row),
    },
    {
      key: 'lastLoggedIn',
      title: '最后登入',
      format: (row) => formatLastLoggedIn(row),
      tdClass: (row) => ({ info: isJustUpdate(row.lastLoggedIn, 48) }),
    },
  ]
}

function formatUsername(row: IUser) {
  return <Link to={`/users/${row.id}`}>{row.username}</Link>
}

function formatEnabled(row: IUser) {
  return row.enabled ? '是' : '--'
}

function formatRegisterDate(row: IUser) {
  return formatDate(row.registerDate)
}

function formatLastLoggedIn(row: IUser) {
  if (row.lastLoggedIn === undefined) {
    return '从未登入'
  } else {
    return dayjs(row.lastLoggedIn).fromNow()
  }
}
