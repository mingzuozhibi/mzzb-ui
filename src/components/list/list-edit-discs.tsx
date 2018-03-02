import * as React from 'react'
import { formatNumber, formatTimeout } from '../../utils/format'
import { EditListModel, EditDiscModel } from './reducer'
import { Column, Table } from '../../lib/table'
import { Command } from '../../lib/command'

interface Props {
  detail: EditListModel
  pushDisc: (id: number, pid: number) => void
  dropDisc: (id: number, pid: number) => void
}

export function ListEditDiscs(props: Props) {

  function getColumns(): Column<EditDiscModel>[] {
    return [
      {
        key: 'id',
        title: 'ID',
        format: (t) => t.id
      },
      {
        key: 'asin',
        title: 'ASIN',
        format: (t) => t.asin
      },
      {
        key: 'rank',
        title: '排名',
        format: (t) => formatRank(t)
      },
      {
        key: 'surplusDays',
        title: '天数',
        format: (t) => `${t.surplusDays}天`
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => t.title
      },
      {
        key: 'control',
        title: '功能',
        format: (t) => formatControl(t)
      },
    ]
  }

  function formatRank(t: EditDiscModel) {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    return `${thisRank}位`
  }

  function formatControl(t: EditDiscModel) {
    return (
      <span>
        <Command onClick={() => props.dropDisc(props.detail.id, t.id)}>移除</Command>
      </span>
    )
  }

  return (
    <div className="list-edit-discs-content">
      <Table
        key={props.detail.id}
        title={props.detail.title}
        subtitle={formatTimeout(props.detail.modifyTime)}
        rows={props.detail.discs}
        columns={getColumns()}
      />
    </div>
  )
}
