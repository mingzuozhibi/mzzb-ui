import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Divider, Icon } from 'antd'
import classNames from 'classnames'
import { Column, Handler, Table } from '../../comps/table/Table'
import { ClosableMessage } from '../../comps/antd'
import { formatNumber, formatTimeout } from '../../funcs/format'
import { isJustUpdated, isSlowUpdated } from '../../funcs/domain'
import { composeCompares, safeCompare } from '../../funcs/compare'
import './Discs.scss'

export interface Data {
  title: string
  discs: Disc[]
  modifyTime?: number
}

export interface Disc {
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
  data?: Data
  error?: string
  handler: Handler
}

const cols = getColumns()

const message = '点击复制按钮可进入复制模式，选中想要复制的碟片，然后再次点击复制即可将排名复制到剪贴板'

export function Discs(props: Props) {

  const {error, data, handler} = props
  const [pcMode, setPcMode] = useState(false)

  return (
    <div className="Discs">
      <ClosableMessage unikey="copymode" message={message}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <>
          <div className="custom-header">
            <Icon type="arrow-left" onClick={() => window.history.back()}/>
            <Divider type="vertical"/>
            {data.modifyTime && (
              <span>更新于{formatTimeout(data.modifyTime)}前</span>
            )}
            <Button onClick={() => setPcMode(!pcMode)}>
              {pcMode ? '智能隐藏列' : '显示所有列'}
            </Button>
          </div>
          <div className="pc-mode-warpper">
            <div className={classNames({'pc-mode': pcMode})}>
              <Table
                rows={data.discs}
                cols={cols}
                title={data.title}
                handler={handler}
                defaultSort={createCompareRank()}
                copyFmt={((disc, idx) => {
                  return `${idx + 1})`
                    + ` ${formatRank(disc)}`
                    + ` 增${(disc.todayPt || 0)}pt`
                    + ` 共${(disc.totalPt || 0)}pt`
                    + ` 预${(disc.guessPt || 0)}pt`
                    + ` 剩${disc.surplusDays}天`
                    + ` [${titleString(disc)}]`
                })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function getColumns(): Column<Disc>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (_, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: '日亚排名',
      format: formatRank,
      tdClass: tdClassRank,
      compare: createCompareRank()
    },
    {
      key: 'addPt',
      title: '日增',
      format: (disc) => `${(disc.todayPt || '----')}点`,
      compare: createComparePt(disc => disc.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积',
      format: (disc) => `${(disc.totalPt || '----')}点`,
      compare: createComparePt(disc => disc.totalPt),
    },
    {
      key: 'gusPt',
      title: '预测',
      format: (disc) => `${(disc.guessPt || '----')}点`,
      compare: createComparePt(disc => disc.guessPt),
    },
    {
      key: 'surp',
      title: '发售',
      format: (disc) => `${disc.surplusDays}天`,
      compare: composeCompares([compareSurp, compareTitle]),
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
      compare: compareTitle,
    },
  ]

}

function formatRank(disc: Disc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return <Link to={`/discs/${disc.id}/records`}>{`${thisRank}位/${prevRank}位`}</Link>
}

export function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{titleString(disc)}</Link>
}

function tdClassRank(disc: Disc) {
  if (isJustUpdated(disc.updateTime)) {
    return 'success'
  }
  if (isSlowUpdated(disc.updateTime)) {
    return 'warning'
  }
  return ''
}

function createCompareRank() {
  return safeCompare<Disc, number>({
    apply: disc => disc.thisRank,
    compare: (a, b) => a - b
  })
}

function createComparePt(apply: (disc: Disc) => number | undefined) {
  return safeCompare<Disc, number>({apply, compare: (a, b) => b - a})
}

export function compareSurp(a: Disc, b: Disc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: Disc, b: Disc) {
  return titleString(a).localeCompare(titleString(b))
}

function titleString(disc: Disc) {
  return disc.titlePc || disc.title
}
