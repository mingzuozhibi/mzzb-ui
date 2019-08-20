import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Switch } from 'antd'
import classNames from 'classnames'
import { State } from '../../hooks/useData'
import { Column, Handler, Table } from '../../comps/table/Table'
import { compareFactory } from '../../funcs/compare'
import { formatNumber, formatTimeout, isJustUpdated, isSlowUpdated } from '../../funcs/format'
import './Discs.scss'

export interface Data {
  mark: string
  title: string
  discs: Disc[]
  modifyTime?: number
}

interface Disc {
  id: number
  asin: string
  title: string
  titlePc?: string
  thisRank?: number
  prevRank?: number
  todayPt?: number
  totalPt?: number
  guessPt?: number
  updateTime?: number
  surplusDays: number
}

interface Props {
  state: State<Data>
  handler: Handler
}

export function Discs({state: {data, error}, handler}: Props) {

  const [pcMode, setPcMode] = useState(false)

  return (
    <div className="Discs">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <>
          <div style={{padding: 8}}>
            <Switch
              checked={pcMode}
              checkedChildren="智能隐藏列"
              unCheckedChildren="显示所有列"
              onChange={(checked) => setPcMode(checked)}
            />
            {data.modifyTime && (
              <span style={{marginLeft: 8}}>更新于{formatTimeout(data.modifyTime)}前</span>
            )}
          </div>
          <div className="pc-mode-warpper">
            <div className={classNames({'pc-mode': pcMode})}>
              <Table
                mark={`Discs-${data.mark}`}
                rows={data.discs}
                cols={getCols()}
                title={data.title}
                handler={handler}
                defaultSort={compareFactory<Disc, number>({
                  apply: disc => disc.thisRank,
                  empty: rank => rank === undefined,
                  compare: (a, b) => a - b
                })}
                copyFmt={((disc, idx) => {
                  return `${idx + 1})`
                    + ` ${formatRank(disc)}`
                    + ` 增${(disc.todayPt || 0)}pt`
                    + ` 共${(disc.totalPt || 0)}pt`
                    + ` 预${(disc.guessPt || 0)}pt`
                    + ` 剩${disc.surplusDays}天`
                    + ` [${formatTitle(disc)}]`
                })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function getCols(): Column<Disc>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (_, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: '日亚排名',
      format: (disc) => <Link to={`/disc/${disc.id}/records`}>{formatRank(disc)}</Link>,
      compare: compareFactory<Disc, number>({
        apply: disc => disc.thisRank,
        empty: rank => rank === undefined,
        compare: (a, b) => a - b
      }),
      tdClass: rankTdClass
    },
    {
      key: 'addPt',
      title: '日增',
      format: (disc) => `${(disc.todayPt || '----')}点`,
      compare: comparePt(disc => disc.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积',
      format: (disc) => `${(disc.totalPt || '----')}点`,
      compare: comparePt(disc => disc.totalPt),
    },
    {
      key: 'gusPt',
      title: '预测',
      format: (disc) => `${(disc.guessPt || '----')}点`,
      compare: comparePt(disc => disc.guessPt),
    },
    {
      key: 'surp',
      title: '发售',
      format: (disc) => `${disc.surplusDays}天`,
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
      format: (disc) => <Link to={`/disc/${disc.id}`}>{formatTitle(disc)}</Link>,
      compare: (a, b) => formatTitle(a).localeCompare(formatTitle(b)),
    },
  ]
}

function formatRank(row: Disc) {
  const thisRank = row.thisRank ? formatNumber(row.thisRank, '****') : '----'
  const prevRank = row.prevRank ? formatNumber(row.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

function comparePt(apply: (disc: Disc) => number | undefined) {
  return compareFactory<Disc, number>({
    apply: apply,
    empty: value => value === undefined,
    compare: (a, b) => b - a
  })
}

function formatTitle(disc: Disc) {
  return disc.titlePc || disc.title
}

function rankTdClass(disc: Disc) {
  if (isJustUpdated(disc.updateTime)) {
    return 'success'
  }
  if (isSlowUpdated(disc.updateTime)) {
    return 'warning'
  }
  return ''
}
