import React from 'react'
import { SakuraModel, viewTypes } from './reducer'
import { formatTimeout } from '../../utils/format'
import { Column, Table } from '../../lib/table'
import { Link } from 'react-router-dom'

interface Props {
  models: SakuraModel[]
  editModelTo: (t: SakuraModel) => string
  editDiscsTo: (t: SakuraModel) => string
}

export function AdminSakuraList(props: Props) {

  function getColumns(): Column<SakuraModel>[] {
    return [
      {
        key: 'id',
        title: '#',
        format: (t, i) => i + 1
      },
      {
        key: 'key',
        title: '索引',
        format: (t) => t.key
      },
      {
        key: 'title',
        title: '标题',
        format: (t) => <Link to={props.editDiscsTo(t)}>{t.title}</Link>
      },
      {
        key: 'enabled',
        title: '启用',
        format: (t) => t.enabled ? '是' : '否'
      },
      {
        key: 'viewType',
        title: '列表类型',
        format: (t) => formatViewType(t)
      },
      {
        key: 'modifyTime',
        title: '上次更新',
        format: (t) => formatTimeout(t.modifyTime)
      },
      {
        key: 'control',
        title: '功能',
        format: (t) => <Link to={props.editModelTo(t)}>编辑</Link>
      },
    ]
  }

  function formatViewType(t: SakuraModel) {
    const find = viewTypes.find(v => v.value === t.viewType)
    return find ? find.label : t.viewType
  }

  return (
    <div className="admin-sakura-list-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
