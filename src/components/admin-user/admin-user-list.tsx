import * as React from 'react'
import { AdminUserModel } from './reducer'
import { Column, Table } from '../../lib/table'
import { ViewportProps } from '../../hoc/Viewport'
import { PageInfo } from '../../common/route-infos'
import { Link } from 'react-router-dom'

interface AdminUserListProps extends ViewportProps {
  pageInfo: PageInfo
  models: AdminUserModel[]
  editTo: (t: AdminUserModel) => string
}

export function AdminUserList(props: AdminUserListProps) {

  function getColumns(): Column<AdminUserModel>[] {
    return [
      {
        key: 'id',
        title: 'ID',
        format: (t) => t.id
      },
      {
        key: 'username',
        title: `${props.pageInfo.modelName}名`,
        format: (t) => t.username
      },
      {
        key: 'enabled',
        title: '启用',
        format: (t) => t.enabled ? '是' : '否'
      },
      {
        key: 'registerDate',
        title: '注册时间',
        format: (t) => formatRegisterDate(t)
      },
      {
        key: 'lastLoggedIn',
        title: '最后登入',
        format: (t) => formatLastLoggedIn(t)
      },
      {
        key: 'control',
        title: '功能',
        format: (t) => <Link to={props.editTo(t)}>编辑</Link>
      }
    ]
  }

  function formatRegisterDate(t: AdminUserModel) {
    return formatLong(t.registerDate, 0, 10)
  }

  function formatLastLoggedIn(t: AdminUserModel) {
    const text = t.lastLoggedIn
    return text ? formatLong(text, 5, 11) : '从未登入'
  }

  function formatLong(text: string, start: number, length: number) {
    return props.viewport!.width <= 600 ? text.substr(start, length) : text
  }

  return (
    <div className="admin-users-list-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
