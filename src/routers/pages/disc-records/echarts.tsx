import { IRecord } from '#DT/disc'
import * as echarts from 'echarts'
import { renderToString } from 'react-dom/server'

export function initEcharts(records: IRecord[]) {
  const dates = records.map((record) => record.date)
  const totalPts = records.map((record) => record.totalPt)
  const guessPts = records.map((record) => record.guessPt)
  const ranks = records.map((record) => {
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
      data: ['排位', '累积', '预测'],
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const b = params[0].name
        const c0 = params[0].data
        const c1 = params[1].data
        const c2 = params[2].data
        return renderTooltip(c0, c1, c2, b)
      },
      position: function (point: any, _params: any, _dom: any, _rect: any, size: any) {
        const mouseX = point[0]
        const mouseY = point[1]
        const contW = size.contentSize[0]
        const contH = size.contentSize[1]
        const viewW = size.viewSize[0]
        const isLeft = mouseX < viewW / 2
        return { top: mouseY - contH - 50, left: isLeft ? mouseX + 30 : mouseX - contW - 30 }
      },
    },
    grid: {
      left: 60,
      right: 50,
    },
    xAxis: {
      type: 'category',
      data: dates,
      inverse: true,
    },
    yAxis: [
      {
        min: 1,
        max: 1e5,
        type: 'log',
        inverse: true,
        axisLabel: {
          formatter: (rank: number) => (rank <= 10000 ? `${rank}位` : `${rank / 10000}万位`),
        },
        splitLine: {
          lineStyle: {
            color: ['#AAA', '#AAA', 'red', '#AAA', '#AAA'],
          },
        },
      },
      {
        name: '(PT)',
        type: 'value',
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        type: 'line',
        name: '排位',
        data: ranks,
      },
      {
        type: 'line',
        name: '累积',
        yAxisIndex: 1,
        data: totalPts,
      },
      {
        type: 'line',
        name: '预测',
        yAxisIndex: 1,
        data: guessPts,
      },
    ],
  })
}

function renderTooltip(c0: any, c1: any, c2: any, b: any) {
  const table = (
    <table className="tooltip-table">
      <tr>
        <td>排名</td>
        <td>{c0 === undefined ? '---' : c0} 位</td>
      </tr>
      <tr>
        <td>累积</td>
        <td>{c1 === undefined ? '---' : c1} pt</td>
      </tr>
      <tr>
        <td>预测</td>
        <td>{c2 === undefined ? '---' : c2} pt</td>
      </tr>
      <tr>
        <td>日期</td>
        <td>{b}</td>
      </tr>
    </table>
  )
  return renderToString(table)
}
