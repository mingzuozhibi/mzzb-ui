import { useAppSelector } from '#A/hooks'
import { RefreshButton } from '#C/button/Refresh'
import { MyColumn, MyTable } from '#C/table/MyTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useAjax } from '#H/useAjax'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { formatNumber } from '#U/format'
import { Button, Modal, Space } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './DiscRecords.scss'

import { IDiscRecords, IRecord } from '#T/disc'
import { discTitle, formatPt } from '#T/disc-utils'
import { initEcharts } from './echarts'

const cols = buildColumns()

export default function DiscRecords() {
  const params = useParams<{ id: string }>()
  const discId = params.id as string

  const { data, ...state } = useOnceRequest(() =>
    fetchResult<IDiscRecords>(`/api/discs/${discId}/records`).then((result) => result.data)
  )

  useEffect(() => {
    data && initEcharts(data)
  }, [data])

  const [isPost, doPost] = useAjax<string>('post')

  function reCompute() {
    doPost(`/api/admin/reComputeDisc2/${discId}`, '重新计算PT', {
      onSuccess(text) {
        Modal.success({ title: '重新计算PT成功', content: text })
        state.refresh()
      },
    })
  }

  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const extraCaption = (
    <Space>
      <span>如果图表显示错误，请尝试刷新</span>
      <RefreshButton state={state} />
      {hasBasic && (
        <Button loading={isPost} onClick={reCompute}>
          重新计算PT
        </Button>
      )}
    </Space>
  )

  const title = data ? discTitle(data) : `载入中`

  return (
    <div className="DiscRecords">
      <MzTopbar title={{ prefix: '碟片历史数据', suffix: title }} />
      <div id="echart_warp" />
      {data && (
        <MyTable
          tag="records"
          rows={data.records}
          cols={cols}
          title="碟片历史数据"
          trClass={trClass(data)}
          extraCaption={extraCaption}
        />
      )}
    </div>
  )
}

function trClass(data: IDiscRecords) {
  return (t: IRecord) => ({ warning: !dayjs(t.date).isBefore(dayjs(data.releaseDate)) })
}

function buildColumns(): MyColumn<IRecord>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'date',
      title: '日期',
      format: (row) => row.date,
    },
    {
      key: 'addPt',
      title: '日增PT',
      format: (row) => formatPt(row.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积PT',
      format: (row) => formatPt(row.totalPt),
    },
    {
      key: 'powPt',
      title: '预测PT',
      format: (row) => formatPt(row.guessPt),
    },
    {
      key: 'averRank',
      title: '平均排名',
      format: (row) => formatRank(row),
    },
  ]
}

function formatRank(row: IRecord) {
  if (row.averRank != undefined && row.averRank < 10) {
    return (
      <span>
        <span style={{ color: 'red' }}>{row.averRank.toFixed(1)}</span>
        <span> 位</span>
      </span>
    )
  } else {
    return (
      <span>
        <span>{row.averRank ? formatNumber(row.averRank, '###,###') : '---'}</span>
        <span> 位</span>
      </span>
    )
  }
}
