import * as React from 'react'
import { Link } from 'react-router-dom'
import { Column, Table } from '../../lib/table'
import { AdminSakuraModel } from './reducer'
import { formatTimeout } from '../../utils/format'

interface AdminSakuraListProps {
  editTo: (t: AdminSakuraModel) => string
  models: AdminSakuraModel[]
}

export function AdminSakuraList(props: AdminSakuraListProps) {

  function getColumns(): Column<AdminSakuraModel>[] {
    return [
      {
        key: 'id',
        title: 'ID',
        format: (t) => t.id
      },
      {
        key: 'key',
        title: '索引',
        format: (t) => t.key
      },
      {
        key: 'title',
        title: '标题',
        format: (t) => t.title
      },
      {
        key: 'enabled',
        title: '启用',
        format: (t) => t.enabled ? '是' : '否'
      },
      {
        key: 'viewType',
        title: '显示类型',
        format: (t) => t.viewType
      },
      {
        key: 'modifyTime',
        title: '上次更新',
        format: (t) => formatModifyTime(t)
      },
      {
        key: 'control',
        title: '功能',
        format: (t) => <Link to={props.editTo(t)}>编辑</Link>
      },
    ]
  }

  function formatModifyTime(t: AdminSakuraModel) {
    return t.modifyTime == null ? '从未更新' : formatTimeout(t.modifyTime)
  }

  return (
    <div className="admin-sakura-list-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
