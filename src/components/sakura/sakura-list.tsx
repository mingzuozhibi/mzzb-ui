import * as React from 'react'
import { SakuraModel } from './reducer'
import { Column, Table } from '../../lib/table'
import { formatTimeout } from '../../utils/format'
import { viewTypes } from '../admin-sakura/reducer'
import { Link } from 'react-router-dom'

interface Props {
  models: SakuraModel[]
  viewDiscsTo: (t: SakuraModel) => string
}

export function SakuraList(props: Props) {

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
        format: (t) => <Link to={props.viewDiscsTo(t)}>{t.title}</Link>
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

  function formatViewType(t: SakuraModel) {
    const find = viewTypes.find(v => v.value === t.viewType)
    return find ? find.label : t.viewType
  }

  return (
    <div className="sakura-list-content">
      <Table rows={props.models} columns={getColumns()}/>
    </div>
  )
}
