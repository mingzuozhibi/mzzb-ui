import * as React from 'react'
import { EditListModel, viewTypes } from './reducer'
import { formatTimeout } from '../../utils/format'
import { Column, Table } from '../../lib/table'
import { Link } from 'react-router-dom'

interface Props {
  models: EditListModel[]
  editOneTo: (t: EditListModel) => string
  editDiscsTo: (t: EditListModel) => string
}

export function ListEditAll(props: Props) {

  function getColumns(): Column<EditListModel>[] {
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
        format: (t) => <Link to={props.editOneTo(t)}>编辑</Link>
      },
    ]
  }

  function formatViewType(t: EditListModel) {
    const find = viewTypes.find(v => v.value === t.viewType)
    return find ? find.label : t.viewType
  }

  return (
    <div className="list-edit-all-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
