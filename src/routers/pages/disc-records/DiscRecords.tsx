import { useAppSelector } from '#CA/hooks'
import { RefreshButton } from '#CC/button/Refresh'
import { MzHeader } from '#CC/header/MzHeader'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { useAjax } from '#CH/useAjax'
import { useData } from '#CH/useOnce'
import { safeWarpper } from '#CU/empty'
import { Button, Modal, Space } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './DiscRecords.scss'

import { IDiscRecords, IRecord } from '#DT/disc'
import { discTitle, formatPt } from '#DU/disc-comps'
import { formatNumber } from '#RU/format'
import { apiToDiscs, apiToSpider } from '#RU/links'
import dayjs from 'dayjs'

import { initEcharts } from './echarts'

const cols = buildColumns()

export default function DiscRecords() {
  const params = useParams<{ id: string }>()
  const discId = params.id as string

  const apiUrl = apiToDiscs(`/${discId}/records`)
  const { data: disc, ...state } = useData<IDiscRecords>(apiUrl)

  useEffect(() => {
    disc && initEcharts(disc.records)
  }, [disc])

  const [isPost, doPost] = useAjax<string>('post')

  function reCompute() {
    doPost(apiToSpider(`/computePt/${discId}`), '重新计算PT', {
      onSuccess(text) {
        Modal.success({ title: '重新计算PT成功', content: text })
        state.refresh()
      },
    })
  }

  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const extraCaption = (
    <Space wrap={true}>
      <RefreshButton state={state} />
      {hasBasic && (
        <Button loading={isPost} onClick={reCompute}>
          重新计算PT
        </Button>
      )}
      <span>如果图表显示错误，请尝试刷新</span>
    </Space>
  )

  const title = safeWarpper(disc, discTitle)

  return (
    <div className="DiscRecords" style={{ maxWidth: 650 }}>
      <MzHeader title={{ prefix: '碟片历史数据', suffix: title }} />
      <div id="echart_warp" />
      {disc && (
        <MzTable
          tag="records"
          rows={disc.records}
          cols={cols}
          trClass={trClass(disc)}
          extraCaption={extraCaption}
        />
      )}
    </div>
  )
}

function trClass(disc: IDiscRecords) {
  return (row: IRecord) => ({
    warning: !dayjs(row.date).isBefore(dayjs(disc.releaseDate)),
  })
}

function buildColumns(): MzColumn<IRecord>[] {
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
