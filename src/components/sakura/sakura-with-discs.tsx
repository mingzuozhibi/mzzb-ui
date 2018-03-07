import * as React from 'react'
import { DiscModel, SakuraModel, SakuraOfDiscsModel } from './reducer'
import { ViewportProps, withViewport } from '../../hoc/Viewport'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import { formatNumber } from '../../utils/format'
import { Command } from '../../lib/command'

interface Props {
  detail: SakuraOfDiscsModel
  toViewDisc: (t: DiscModel) => void
  toViewRank: (t: DiscModel) => void
}

function SakuraDiscs(props: Props & ViewportProps) {

  function getColumns(): Column<DiscModel>[] {
    return [
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => <Command onClick={toViewRank(t)}>{formatRank(t)}</Command>
      },
      {
        key: 'totalPt',
        title: '累积PT',
        format: (t) => `${(t.totalPt || '----')} pt`
      },
      {
        key: 'surplusDays',
        title: '剩余日期',
        format: (t) => `${t.surplusDays} 天`
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <Command onClick={toViewDisc(t)}>{formatTitle(t)}</Command>
      },
    ]
  }

  function formatRank(t: DiscModel) {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    const prevRank = t.prevRank ? formatNumber(t.prevRank, '****') : '----'
    return `${thisRank}位/${prevRank}位`
  }

  function toViewDisc(t: DiscModel) {
    return () => props.toViewDisc(t)
  }

  function toViewRank(t: DiscModel) {
    return () => props.toViewRank(t)
  }

  function formatTitle(t: DiscModel) {
    if (props.viewport.width > 600) {
      return t.titlePc || t.title
    } else {
      return t.titleMo || t.titlePc || t.title
    }
  }

  function formatModifyTime(sakura: SakuraModel) {
    if (sakura.modifyTime) {
      return (
        <Timer
          time={sakura.modifyTime}
          timeout={1000}
          render={(state => `${state.hour}时${state.minute}分${state.second}秒前`)}
        />
      )
    } else {
      return '从未更新'
    }
  }

  return (
    <div className="sakura-discs-content">
      <Table
        key={props.detail.id}
        title={props.detail.title}
        subtitle={formatModifyTime(props.detail)}
        rows={props.detail.discs}
        columns={getColumns()}
      />
    </div>
  )
}

const WithViewport = withViewport<Props>(SakuraDiscs)

export { WithViewport as SakuraDiscs }
