import * as React from 'react'
import { DiscOfRecordsModel, RecordModel } from './reducer'
import { Column, Table } from '../../lib/table'

interface Props {
  detailOfRanks: DiscOfRecordsModel
}

export function DiscRecords(props: Props) {

  function getColumns(): Column<RecordModel>[] {
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

  function formatTitle(t: DiscOfRecordsModel) {
    return t.titlePc || t.title
  }

  return (
    <div className="disc-records-content">
      <div style={{fontSize: 18, padding: 10}}>
        {formatTitle(props.detailOfRanks)}
      </div>
      <Table
        rows={props.detailOfRanks.records}
        columns={getColumns()}
      />
    </div>
  )
}
