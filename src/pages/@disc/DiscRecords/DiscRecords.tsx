import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import echarts from 'echarts'
import './DiscRecords.scss'

import { useData } from '../../../hooks/useData'
import { formatNumber } from '../../../funcs/format'
import { CustomHeader } from '../../../comps/CustomHeader'
import { Column, Table } from '../../../comps/@table/Table'

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

  const [{error, data}, handler] = useData<Data>(`/api/discs/${match.params.id}/records`)

  useEffect(() => {
    data && initEchart(data)
  }, [data])

  const title = data ? `碟片历史数据：${data.titlePc || data.title}` : `载入中`

  return (
    <div className="DiscRecords">
      <CustomHeader header={title} error={error}/>
      <div id="echart_warp"/>
      {data && (
        <Table
          rows={data.records}
          cols={cols}
          handler={handler}
          extraCaption={<span style={{marginLeft: 8}}>如果图表显示错误，请尝试刷新</span>}
        />
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

function initEchart(data?: Data) {
  if (!data) return

  const dates = data.records.map(record => record.date)
  const sumPts = data.records.map(record => record.totalPt)
  const gesPts = data.records.map(record => record.guessPt)
  const ranks = data.records.map(record => record.averRank && record.averRank > 10000 ? 10000 : record.averRank)

  const echartWarp = document.getElementById('echart_warp') as HTMLDivElement
  const divElement = document.createElement('div')
  divElement.style.width = '100%'
  divElement.style.height = '400px'
  echartWarp.innerHTML = ''
  echartWarp.appendChild(divElement)

  const myChart = echarts.init(divElement)
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
