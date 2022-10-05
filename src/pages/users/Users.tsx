import { MzHeader } from '#C/header/MzHeader'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useData } from '#H/useOnce'
import { safeWarpper } from '#U/domain'
import { Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './Users.scss'

import { apiToUsers, linkToUsers } from '#A/links'
import { IUser } from '#T/user'
import { isJustUpdate } from '#U/date/check'
import dayjs from 'dayjs'

const cols = buildColumns()

export default function Users() {
  const navigate = useNavigate()
  const apiUrl = apiToUsers()
  const { data: users, ...state } = useData<IUser[]>(apiUrl)

  return (
    <div className="Users" style={{ maxWidth: 650 }}>
      <MzHeader
        title="用户管理"
        state={state}
        extra={[
          <Button key="1" onClick={() => navigate(linkToUsers(`/add`))}>
            添加用户
          </Button>,
        ]}
      />
      {safeWarpper(users, (users) => (
        <MzTable tag="users" rows={users} cols={cols} />
      ))}
    </div>
  )
}

function buildColumns(): MzColumn<IUser>[] {
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
  return <Link to={linkToUsers(`/${row.id}`)}>{row.username}</Link>
}

function formatEnabled(row: IUser) {
  return row.enabled ? '是' : '--'
}

function formatRegisterDate(row: IUser) {
  return dayjs(row.registerDate).format('YYYY-MM-DD')
}

function formatLastLoggedIn(row: IUser) {
  if (row.lastLoggedIn === undefined) {
    return '从未登入'
  } else {
    return dayjs(row.lastLoggedIn).fromNow()
  }
}
