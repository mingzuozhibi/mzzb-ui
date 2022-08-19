import { MzHeader } from '##/comps/header/MzHeader'
import { MzColumn, MzTable } from '##/comps/table/MzTable'
import { useAjax, useData } from '##/hooks'
import { formatNumber } from '#F/format'
import { formatPt } from '#P/@funcs'
import { InjectRole, injectRole } from '#P/@inject'
import { Button, Modal } from 'antd'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './DiscRecords.scss'

interface Data {
  title: string
  titlePc: string
  records: Record[]
  releaseDate: string
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

export default injectRole(DiscRecords)

function DiscRecords({ isBasic }: InjectRole) {
  const params = useParams<{ id: string }>()
  const [{ error, data }, handler] = useData<Data>(`/api/discs/${params.id}/records`)
  const [_, doPost] = useAjax<string>('post')

  useEffect(() => {
    data && initEchart(data)
  }, [data])

  function reCompute() {
    doPost(`/api/admin/reComputeDisc2/${params.id}`, '重新计算PT', {
      onSuccess(text) {
        Modal.success({ title: '重新计算PT成功', content: text })
        handler.refresh()
      },
    })
  }

  const title = data ? `碟片历史数据：${data.titlePc || data.title}` : `载入中`

  const extraCaption = [
    <span style={{ marginLeft: 8 }}>如果图表显示错误，请尝试刷新</span>,
    isBasic ? (
      <Button style={{ marginLeft: 8 }} onClick={reCompute}>
        重新计算PT
      </Button>
    ) : null,
  ]

  return (
    <div className="DiscRecords">
      <MzHeader header={title} error={error} />
      <div id="echart_warp" />
      {data && (
        <MzTable
          rows={data.records}
          cols={cols}
          trClass={trClass(data)}
          handler={handler}
          extraCaption={extraCaption}
        />
      )}
    </div>
  )
}

function trClass(data: Data) {
  return (t: Record) => ({ warning: !dayjs(t.date).isBefore(dayjs(data.releaseDate)) })
}

function getColumns(): MzColumn<Record>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (t, i) => i + 1,
    },
    {
      key: 'date',
      title: '日期',
      format: (t) => t.date,
    },
    {
      key: 'addPt',
      title: '日增PT',
      format: (t) => formatPt(t.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积PT',
      format: (t) => formatPt(t.totalPt),
    },
    {
      key: 'powPt',
      title: '预测PT',
      format: (t) => formatPt(t.guessPt),
    },
    {
      key: 'averRank',
      title: '平均排名',
      format: (t) => formatRank(t),
    },
  ]
}

function formatRank(t: Record) {
  if (t.averRank != undefined && t.averRank < 10) {
    return (
      <>
        <span style={{ color: 'red' }}>{t.averRank.toFixed(1)}</span> 位
      </>
    )
  } else {
    return `${t.averRank ? formatNumber(t.averRank, '###,###') : '---'} 位`
  }
}

function initEchart(data?: Data) {
  if (!data) return

  const dates = data.records.map((record) => record.date)
  const sumPts = data.records.map((record) => record.totalPt)
  const gesPts = data.records.map((record) => record.guessPt)
  const ranks = data.records.map((record) => {
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
      formatter: '排名：{c0}位<br>累积：{c1}pt<br>预测：{c2}pt<br>{b}',
      position: function (point, params, dom, rect, size: any) {
        const mouseX = point[0] as number
        const mouseY = point[1] as number
        const contentW = size.contentSize[0]
        const contentH = size.contentSize[1]
        const isLeft = mouseX < size.viewSize[0] / 2
        return { top: mouseY - contentH - 50, left: isLeft ? mouseX + 30 : mouseX - contentW - 30 }
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
        data: sumPts,
      },
      {
        type: 'line',
        name: '预测',
        yAxisIndex: 1,
        data: gesPts,
      },
    ],
  })
}
