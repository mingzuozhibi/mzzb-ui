import React, { useEffect } from 'react'
import echarts from 'echarts'
import './DiscRecords.scss'

import { useData } from '../../../hooks/useData'
import { formatNumber } from '../../../funcs/format'
import { CustomHeader } from '../../../comps/CustomHeader'
import { Column, Table } from '../../../comps/@table/Table'
import { RouteProps } from '../../@types'

interface Data {
  title: string
  release: string
  records: Record[]
}

interface Record {
  id: number
  date: string
  addPoint?: number
  sumPoint?: number
  powPoint?: number
  averRank?: number
}

const cols = getColumns()

export default function DiscRecords({ match }: RouteProps<{ id: string }>) {

  const [{ error, data }, handler] = useData<Data>(`/api/records/find/disc/${match.params.id}`)

  useEffect(() => {
    data && initEchart(data)
  }, [data])

  const title = data ? `碟片历史数据：${data.title}` : `载入中`

  return (
    <div className="DiscRecords">
      <CustomHeader header={title} error={error} />
      <div id="echart_warp" />
      {data && (
        <Table
          rows={data.records}
          cols={cols}
          trClass={trClass(data)}
          handler={handler}
          extraCaption={<span style={{ marginLeft: 8 }}>如果图表显示错误，请尝试刷新</span>}
        />
      )}
    </div>
  )

}

function trClass(data: Data) {
  return (t: Record) => ({ warning: t.date.localeCompare(data.release) >= 0 })
}

function getColumns(): Column<Record>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (t, i) => i + 1
    },
    {
      key: 'date',
      title: '日期',
      format: (t) => t.date
    },
    {
      key: 'addPt',
      title: '日增PT',
      format: (t) => formatPt(t.addPoint)
    },
    {
      key: 'sumPt',
      title: '累积PT',
      format: (t) => formatPt(t.sumPoint)
    },
    {
      key: 'powPt',
      title: '预测PT',
      format: (t) => formatPt(t.powPoint)
    },
    {
      key: 'averRank',
      title: '平均排名',
      format: (t) => formatRank(t)
    },
  ]
}

function formatDouble(double?: number) {
  if (double === undefined) return undefined
  if (double < 10) {
    return double.toFixed(1)
  }
  return formatNumber(Math.floor(double), '###,###')
}

function formatPt(pt?: number) {
  const format = formatDouble(pt)
  return format === undefined ? '---' : `${format} pt`
}


function formatRank(t: Record) {
  const format = formatDouble(t.averRank)
  return format === undefined ? '---' : `${format} 位`
}

function initEchart(data?: Data) {
  if (!data) return

  const dates = data.records.map(record => record.date)
  const sumPts = data.records.map(record => record.sumPoint)
  const powPts = data.records.map(record => record.powPoint)
  const ranks = data.records.map(record => {
    if (record.averRank !== undefined && record.averRank < 10) {
      record.averRank = Math.floor(record.averRank * 10) / 10
    }
    return record.averRank
  })

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
        return { top: mouseY - contentH - 50, left: isLeft ? mouseX + 30 : mouseX - contentW - 30 }
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
        min: 1,
        max: 1e5,
        type: 'log',
        inverse: true,
        axisLabel: {
          formatter: (rank: number) => rank <= 10000 ? `${rank}位` : `${rank / 10000}万位`
        },
        splitLine: {
          lineStyle: {
            color: ['#AAA', '#AAA', 'red', '#AAA', '#AAA']
          }
        }
      },
      {
        name: '(PT)',
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
        data: powPts
      }
    ]
  })
}
