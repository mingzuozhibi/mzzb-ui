import * as React from 'react'
import { SakuraModel, viewTypes } from './reducer'
import { formatTimeout } from '../../utils/format'
import { Column, Table } from '../../lib/table'
import { Link } from 'react-router-dom'

interface AdminSakuraListProps {
  models: SakuraModel[]
  editTo: (t: SakuraModel) => string
  viewOfDiscTo: (t: SakuraModel) => string
}

export function AdminSakuraList(props: AdminSakuraListProps) {

  function getColumns(): Column<SakuraModel>[] {
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
        format: (t) => formatControl(t)
      },
    ]
  }

  function formatViewType(t: SakuraModel) {
    const find = viewTypes.find(v => v.value === t.viewType)
    return find ? find.label : t.viewType
  }

  function formatControl(t: SakuraModel) {
    return (
      <span>
        <Link to={props.editTo(t)} style={{marginRight: 10}}>编辑</Link>
        <Link to={props.viewOfDiscTo(t)}>碟片</Link>
      </span>
    )
  }

  return (
    <div className="admin-sakura-list-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
