import React from 'react'
import { DiscModel, SakuraModel, SakuraOfDiscsModel } from './reducer'
import { ViewportProps, withViewport } from '../../hoc/Viewport'
import { compareFactory } from '../../utils/compare'
import { Column, Table } from '../../lib/table'
import { formatNumber } from '../../utils/format'
import { Timer } from '../../lib/timer'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

interface Props {
  detail: SakuraOfDiscsModel
  isPcMode: boolean
}

function SakuraDiscs(props: Props & ViewportProps) {

  function getColumns(): Column<DiscModel>[] {
    return [
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => <Link to={`/disc/${t.id}/records`}>{formatRank(t)}</Link>,
        tdClass: (t) => rankTdClass(t),
        compare: compareFactory<DiscModel, number | undefined>({
          apply: model => model.thisRank,
          check: value => value === undefined || value === 0,
          compare: (a, b) => a! - b!
        })
      },
      {
        key: 'todayPt',
        title: '日增',
        format: (t) => formatPt(t, t.todayPt),
        compare: comparePt(model => model.todayPt),
      },
      {
        key: 'totalPt',
        title: '累积',
        format: (t) => formatPt(t, t.totalPt),
        compare: comparePt(model => model.totalPt),
      },
      {
        key: 'guessPt',
        title: '预测',
        format: (t) => formatPt(t, t.guessPt),
        compare: comparePt(model => model.guessPt),
      },
      {
        key: 'surplusDays',
        title: '发售',
        format: (t) => `${t.surplusDays} 天`,
        compare: (a, b) => {
          if (a.surplusDays !== b.surplusDays) {
            return a.surplusDays - b.surplusDays
          }
          return formatTitle(a).localeCompare(formatTitle(b))
        },
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <Link to={`/disc/${t.id}`}>{formatTitle(t)}</Link>,
        compare: (a, b) => formatTitle(a).localeCompare(formatTitle(b)),
      },
    ]
  }

  function formatRank(t: DiscModel) {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    const prevRank = t.prevRank ? formatNumber(t.prevRank, '****') : '----'
    return `${thisRank}位/${prevRank}位`
  }

  function formatPt(t: DiscModel, n?: number) {
    const isSakura = t.updateType === 'Sakura'
    return `${(n || '----')} ${isSakura ? 'pt' : '点'}`
  }

  function comparePt(apply: (model: DiscModel) => number | undefined) {
    return compareFactory<DiscModel, number | undefined>({
      apply: apply,
      check: value => value === undefined,
      compare: (a, b) => b! - a!
    })
  }

  function formatTitle(t: DiscModel) {
    if (props.viewport.width > 600) {
      return t.titlePc || t.title
    } else {
      return t.titleMo || t.titlePc || t.title
    }
  }

  function rankTdClass(t: DiscModel) {
    const HOUR = 3600 * 1000
    if (t.updateTime) {
      const timeout = new Date().getTime() - t.updateTime
      if (timeout < HOUR) {
        return 'success'
      } else if (timeout > 6.1 * HOUR) {
        return 'warning'
      }
    }
    return ''
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
