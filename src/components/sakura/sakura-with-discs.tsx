import * as React from 'react'
import { DiscModel, SakuraModel, SakuraOfDiscsModel } from './reducer'
import { ViewportProps, withViewport } from '../../hoc/Viewport'
import { compareFactory } from '../../utils/compare'
import { Column, Table } from '../../lib/table'
import { formatNumber } from '../../utils/format'
import { Command } from '../../lib/command'
import { Timer } from '../../lib/timer'
import * as classNames from 'classnames'

interface Props {
  detail: SakuraOfDiscsModel
  isPcMode: boolean
  toViewDisc: (t: DiscModel) => void
  toViewRank: (t: DiscModel) => void
}

function SakuraDiscs(props: Props & ViewportProps) {

  function getColumns(): Column<DiscModel>[] {
    return [
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => <Command onClick={toViewRank(t)}>{formatRank(t)}</Command>,
        compare: compareFactory<DiscModel, number | undefined>({
          apply: model => model.thisRank,
          check: value => value === undefined,
          compare: (a, b) => a! - b!
        }),
      },
      {
        key: 'todayPt',
        title: '日增',
        format: (t) => `${(t.todayPt || '----')} pt`,
        compare: compareFactory<DiscModel, number | undefined>({
          apply: model => model.todayPt,
          check: value => value === undefined,
          compare: (a, b) => b! - a!
        }),
      },
      {
        key: 'totalPt',
        title: '累积',
        format: (t) => `${(t.totalPt || '----')} pt`,
        compare: compareFactory<DiscModel, number | undefined>({
          apply: model => model.totalPt,
          check: value => value === undefined,
          compare: (a, b) => b! - a!
        }),
      },
      {
        key: 'guessPt',
        title: '预测',
        format: (t) => `${(t.guessPt || '----')} pt`,
        compare: compareFactory<DiscModel, number | undefined>({
          apply: model => model.guessPt,
          check: value => value === undefined,
          compare: (a, b) => b! - a!
        }),
      },
      {
        key: 'surplusDays',
        title: '发售',
        format: (t) => `${t.surplusDays} 天`,
        compare: (a, b) => a.surplusDays - b.surplusDays,
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <Command onClick={toViewDisc(t)}>{formatTitle(t)}</Command>,
        compare: (a, b) => formatTitle(a).localeCompare(formatTitle(b)),
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

  const className = classNames({
    'pc-mode': props.isPcMode
  })

  return (
    <div className="sakura-discs-content">
      <div className={className}>
        <Table
          name={`sakura-discs-${props.detail.key}`}
          title={props.detail.title}
          subtitle={formatModifyTime(props.detail)}
          rows={props.detail.discs}
          columns={getColumns()}
        />
      </div>
    </div>
  )
}

const WithViewport = withViewport<Props>(SakuraDiscs)

export { WithViewport as SakuraDiscs }
