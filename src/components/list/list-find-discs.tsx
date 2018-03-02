import * as React from 'react'
import { formatNumber, formatTimeout } from '../../utils/format'
import { FindListModel, FindDiscModel } from './reducer'
import { Column, Table } from '../../lib/table'

interface Props {
  detail: FindListModel
}

export function ListFindDiscs(props: Props) {

  function getColumns(): Column<FindDiscModel>[] {
    return [
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => formatRank(t)
      },
      {
        key: 'totalPt',
        title: '累积PT',
        format: (t) => formatTotalPt(t)
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => t.title
      },
    ]
  }

  function formatRank(t: FindDiscModel) {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    const prevRank = t.prevRank ? formatNumber(t.prevRank, '****') : '----'
    return `${thisRank}位/${prevRank}位`
  }

  function formatTotalPt(t: FindDiscModel) {
    const totalPt = t.totalPt || '----'
    return `${totalPt} pt`
  }

  return (
    <div className="list-find-discs-content">
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
