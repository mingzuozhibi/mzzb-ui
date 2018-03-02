import * as React from 'react'
import { FindListModel, viewTypes } from './reducer'
import { formatTimeout } from '../../utils/format'
import { Column, Table } from '../../lib/table'
import { Link } from 'react-router-dom'

interface Props {
  models: FindListModel[]
  findDiscsTo: (t: FindListModel) => string
}

export function ListFindAll(props: Props) {

  function getColumns(): Column<FindListModel>[] {
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
        format: (t) => <Link to={props.findDiscsTo(t)}>{t.title}</Link>
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
    ]
  }

  function formatViewType(t: FindListModel) {
    const find = viewTypes.find(v => v.value === t.viewType)
    return find ? find.label : t.viewType
  }

  return (
    <div className="list-find-all-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
