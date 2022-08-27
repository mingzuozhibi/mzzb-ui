import { MzColumn, MzTable } from '#C/table/MzTable'
import { useData } from '#H/useData'
import { useTitle } from '#H/useTitle'
import { useWidth } from '#H/useWidth'
import { IUser } from '#T/user'
import { isEmpty } from '#U/domain'
import { Alert, Button } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Users.scss'

export default function Users() {
  const navigate = useNavigate()

  const [{ error, data }, handler] = useData<IUser[]>(`/api/users`)

  const width = useWidth('.Users')
  const cols = useMemo(() => buildColumns(width), [width])
  const addUserButton = (
    <Button.Group>
      <Button onClick={() => navigate(`/users/add`)}>添加用户</Button>
    </Button.Group>
  )

  useTitle('用户管理')

  return (
    <div className="Users">
      {error && <Alert message={error} type="error" />}
      {data && (
        <MzTable
          rows={data}
          cols={cols}
          title="用户管理"
          handler={handler}
          extraCaption={addUserButton}
        />
      )}
    </div>
  )
}

function buildColumns(width: number): MzColumn<IUser>[] {
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
      format: (row) => (row.enabled ? '是' : '--'),
    },
    {
      key: 'registerDate',
      title: '注册时间',
      format: (row) => formatRegisterDate(row, width),
    },
    {
      key: 'lastLoggedIn',
      title: '最后登入',
      format: (row) => formatLastLoggedIn(row, width),
      tdClass: (row) => (justLogged(row) ? 'info' : ''),
    },
  ]
}

function formatUsername(row: IUser) {
  return <Link to={`/users/${row.id}`}>{row.username}</Link>
}

function formatRegisterDate(row: IUser, width: number) {
  return width <= 500
    ? dayjs(row.registerDate).format('YYYY-MM-DD')
    : dayjs(row.registerDate).format('YYYY-MM-DD HH:mm:ss')
}

function formatLastLoggedIn(row: IUser, width: number) {
  if (isEmpty(row.lastLoggedIn)) return '从未登入'
  return dayjs(row.lastLoggedIn).fromNow()
}

function justLogged(row: IUser) {
  if (!row.lastLoggedIn) return false
  const time = new Date(row.lastLoggedIn).getTime()
  return Date.now() - time < 2 * 86400 * 1000
}
