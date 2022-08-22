import { MzColumn, MzTable } from '#C/table/MzTable'
import { useData } from '#H/useData'
import { useTitle } from '#H/useTitle'
import { useWidth } from '#H/useWidth'
import { IUser } from '#T/user'
import { isEmpty } from '#U/domain'
import { EditOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Users.scss'

export default function Users() {
  const navigate = useNavigate()

  const [{ error, data }, handler] = useData<IUser[]>(`/api/users`)

  const width = useWidth('.Users')
  const cols = useMemo(() => getColumns(width), [width])
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

function getColumns(width: number): MzColumn<IUser>[] {
  return [
    {
      key: 'id',
      title: 'ID',
      format: (t) => t.id,
    },
    {
      key: 'username',
      title: `用户名`,
      format: (t) => t.username,
    },
    {
      key: 'enabled',
      title: '启用',
      format: (t) => (t.enabled ? '是' : '--'),
    },
    {
      key: 'registerDate',
      title: '注册时间',
      format: (t) => formatRegisterDate(t, width),
    },
    {
      key: 'lastLoggedIn',
      title: '最后登入',
      format: (t) => formatLastLoggedIn(t, width),
      tdClass: (t) => (justLogged(t) ? 'info' : ''),
    },
    {
      key: 'command',
      title: '操作',
      format: formatCommand,
    },
  ]
}

function formatRegisterDate(t: IUser, width: number) {
  return width <= 500
    ? dayjs(t.registerDate).format('YYYY-MM-DD')
    : dayjs(t.registerDate).format('YYYY-MM-DD HH:mm:ss')
}

function formatLastLoggedIn(t: IUser, width: number) {
  if (isEmpty(t.lastLoggedIn)) return '从未登入'
  return width <= 500
    ? dayjs(t.lastLoggedIn).format('MM-DD HH:mm')
    : dayjs(t.lastLoggedIn).format('YYYY-MM-DD HH:mm:ss')
}

function justLogged(t: IUser) {
  if (!t.lastLoggedIn) return false
  const time = new Date(t.lastLoggedIn).getTime()
  return Date.now() - time < 2 * 86400 * 1000
}

function formatCommand(t: IUser) {
  return (
    <Link to={`/users/${t.id}`}>
      <EditOutlined />
    </Link>
  )
}
