import * as React from 'react'
import { DiscOfRanksModel, DiscRanksModel } from './reducer'
import { Column, Table } from '../../lib/table'

interface Props {
  detailOfRanks: DiscOfRanksModel
}

export function DiscRank(props: Props) {

  function getColumns(): Column<DiscRanksModel>[] {
    return [
      {
        key: 'id',
        title: '#',
        format: (t, i) => i + 1
      },
      {
        key: 'date',
        title: '日期',
        format: (t) => t.date
      },
      {
        key: 'todayPt',
        title: '日增PT',
        format: (t) => t.todayPt
      },
      {
        key: 'totalPt',
        title: '累积PT',
        format: (t) => t.totalPt
      },
      {
        key: 'averRank',
        title: '平均排名',
        format: (t) => t.averRank || '-'
      },
    ]
  }

  function formatTitle(t: DiscOfRanksModel) {
    return t.titlePc || t.title
  }

  return (
    <div className="disc-ranks-content">
      <div style={{fontSize: 18, padding: 10}}>
        {formatTitle(props.detailOfRanks)}
      </div>
      <Table
        rows={props.detailOfRanks.ranks}
        columns={getColumns()}
      />
    </div>
  )
}
