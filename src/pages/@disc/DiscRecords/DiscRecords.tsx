import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Alert, PageHeader } from 'antd'
import { useData } from '../../../hooks/useData'
import { useTitle } from '../../../hooks/hooks'
import { Column, Table } from '../../../comps/@table/Table'
import { formatNumber } from '../../../funcs/format'

interface Data {
  title: string
  titlePc: string
  records: Record[]
}

interface Record {
  id: number
  date: string
  todayPt?: number
  totalPt?: number
  averRank?: number
}

const cols = getColumns()

export default function DiscRecords({match}: RouteComponentProps<{ id: string }>) {

  const [{error, data}] = useData<Data>(`/api/discs/${match.params.id}/records`)

  useTitle(data ? `所有排名：${formatTitle(data)}` : '排名载入中')

  return (
    <div className="DiscRecords">
      <PageHeader title="碟片排名" onBack={() => window.history.back()}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table rows={data.records} cols={cols} title={`所有排名：${formatTitle(data)}`}/>
      )}
    </div>
  )

}

function getColumns(): Column<Record>[] {
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
      format: (t) => `${(t.todayPt || '----')} pt`
    },
    {
      key: 'totalPt',
      title: '累积PT',
      format: (t) => `${(t.totalPt || '----')} pt`
    },
    {
      key: 'averRank',
      title: '平均排名',
      format: (t) => formatRank(t)
    },
  ]
}

function formatRank(t: Record) {
  const averRank = t.averRank ? formatNumber(t.averRank, '***,***') : '---,---'
  return `${averRank}位`
}

function formatTitle(t: Data) {
  return t.titlePc || t.title
}
