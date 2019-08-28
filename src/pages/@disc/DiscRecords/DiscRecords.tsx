import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Alert, PageHeader } from 'antd'
import echarts from 'echarts'
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
  guessPt?: number
  averRank?: number
}

const cols = getColumns()

export default function DiscRecords({match}: RouteComponentProps<{ id: string }>) {

  const [{error, data}] = useData<Data>(`/api/discs/${match.params.id}/records`)

  useEffect(() => {
    if (data) {
      const dates = data.records.map(record => record.date)
      const sumPts = data.records.map(record => record.totalPt)
      const gesPts = data.records.map(record => record.guessPt)
      const ranks = data.records.map(record => {
        if (record.averRank) {
          return record.averRank < 10000 ? record.averRank : 10000
        } else {
          return undefined
        }
      })

      const myChart = echarts.init(document.getElementById('echarts') as HTMLDivElement)
      myChart.setOption({
        legend: {
          data: ['排位', '累积', '预测']
        },
        tooltip: {
          trigger: 'axis',
          formatter: '排名：{c0}位<br>累积：{c1}pt<br>预测：{c2}pt<br>{b}',
          position: function (point, params, dom, rect, size: any) {
            const mouseX = point[0] as number
            const mouseY = point[1] as number
            const contentW = size.contentSize[0]
            const contentH = size.contentSize[1]
            const isLeft = mouseX < size.viewSize[0] / 2
            return {top: mouseY - contentH - 50, left: isLeft ? mouseX + 30 : mouseX - contentW - 30}
          }
        },
        grid: {
          left: 60,
          right: 50
        },
        xAxis: {
          type: 'category',
          data: dates,
          inverse: true
        },
        yAxis: [
          {
            type: 'value',
            name: '排位',
            inverse: true,
            axisLabel: {
              formatter: '{value}位'
            }
          },
          {
            name: 'PT',
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            name: '排位',
            data: ranks
          },
          {
            type: 'line',
            name: '累积',
            yAxisIndex: 1,
            data: sumPts
          },
          {
            type: 'line',
            name: '预测',
            yAxisIndex: 1,
            data: gesPts
          }
        ]
      })
    }
  }, [data])

  useTitle(data ? `所有排名：${formatTitle(data)}` : '排名载入中')

  return (
    <div className="DiscRecords">
      <PageHeader title="碟片排名" onBack={() => window.history.back()}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
      <div id="echarts" style={{height: 400, width: '100%'}}/>
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
      key: 'guessPt',
      title: '预测PT',
      format: (t) => `${(t.guessPt || '----')} pt`
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
