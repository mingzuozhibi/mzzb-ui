import React, { HTMLProps, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Alert, Button, PageHeader } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { useData, State } from '../../../hooks/useData'
import { useTitle } from '../../../hooks/hooks'
import { Column, Table } from '../../../comps/@table/Table'
import './Users.scss'

import { User } from '../../../@version/token'
import { formatTime } from '../../../funcs/format'
import { CustomPagination } from '../../../comps/CustomPagination'
import { Handler } from '../../../reducers/@domain'

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

interface StateRenderProps<T> extends HTMLProps<HTMLDivElement> {
  state: State<T>
  handler?: Handler
  title?: string
  extra?: React.ReactNode[]
  render: (data: T) => React.ReactNode
  onChangePage?: (page: number, size?: number) => void
}

function StateRender<T>(props: StateRenderProps<T>) {
  const { state, handler, title, extra = [], render, onChangePage, ...otherProps } = props
  const { error, data, page } = state

  useTitle(title)
  const history = useHistory()
  const extraMemo = useMemo(() => {
    const refreshButton = handler && (
      <Button key="refresh" onClick={handler.refresh} loading={handler.loading}>刷新</Button>
    )
    return [refreshButton, ...extra]
  }, [handler, extra])

  return (
    <div {...otherProps}>
      {title && (
        <PageHeader title={title} onBack={() => history.goBack()} extra={extraMemo} />
      )}
      {error && (
        <Alert message={error} type="error" />
      )}
      {data && render(data)}
      {page && onChangePage && (
        <CustomPagination page={page} onChange={onChangePage} />
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
