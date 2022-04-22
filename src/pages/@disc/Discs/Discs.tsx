import { Handler } from '##/@domain'
import { Column, Table } from '#C/@table/Table'
import { CustomHeader } from '#C/CustomHeader'
import { CustomMessage } from '#C/CustomMessage'
import { composeCompares, safeCompare } from '#F/compare'
import { isJustUpdated, isSlowUpdated } from '#F/domain'
import { formatNumber, formatTimeout } from '#F/format'
import { compareSurp, compareTitle, discTitle, formatPt } from '#P/@funcs'
import { Disc } from '#P/@types'
import { Button } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Discs.scss'

export interface Data {
  title: string
  discs: Disc[]
  modifyTime?: number
}

interface Props {
  data?: Data
  error?: string
  handler: Handler
}

const cols = getColumns()

const message =
  '点击复制按钮可进入复制模式，选中想要复制的碟片，然后再次点击复制即可将排名复制到剪贴板'

export function Discs(props: Props) {
  const { error, data, handler } = props
  const [pcMode, setPcMode] = useState(false)
  const title = data ? data.title : '载入中'

  const replace = data && (
    <>
      {data.modifyTime && <span>更新于{formatTimeout(data.modifyTime)}前</span>}
      <Button onClick={() => setPcMode(!pcMode)}>{pcMode ? '智能隐藏列' : '显示所有列'}</Button>
    </>
  )

  return (
    <div className="Discs">
      <CustomMessage unikey="copymode" message={message} />
      <CustomHeader header="载入中" title={title} error={error} replace={replace} />
      {data && (
        <>
          <div className="pc-mode-warpper">
            <div className={classNames({ 'pc-mode': pcMode })}>
              <Table
                rows={data.discs}
                cols={cols}
                title={data.title}
                handler={handler}
                defaultSort={createCompareRank()}
                copyFmt={(disc, idx) => {
                  return (
                    `${idx + 1})` +
                    ` ${discRank(disc)}` +
                    ` 增${disc.todayPt || 0}pt` +
                    ` 共${disc.totalPt || 0}pt` +
                    ` 预${disc.guessPt || 0}pt` +
                    ` 剩${disc.surplusDays}天` +
                    ` [${discTitle(disc)}]`
                  )
                }}
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
      compare: createCompareRank(),
    },
    {
      key: 'addPt',
      title: '日增',
      format: (disc) => formatPt(disc.todayPt),
      compare: createComparePt((disc) => disc.todayPt),
    },
    {
      key: 'sumPt',
      title: '累积',
      format: (disc) => formatPt(disc.totalPt),
      compare: createComparePt((disc) => disc.totalPt),
    },
    {
      key: 'gusPt',
      title: '预测',
      format: (disc) => formatPt(disc.guessPt),
      compare: createComparePt((disc) => disc.guessPt),
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

function discRank(disc: Disc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

function formatRank(disc: Disc) {
  return <Link to={`/discs/${disc.id}/records`}>{discRank(disc)}</Link>
}

function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>
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
    apply: (disc) => disc.thisRank,
    compare: (a, b) => a - b,
  })
}

function createComparePt(apply: (disc: Disc) => number | undefined) {
  return safeCompare<Disc, number>({ apply, compare: (a, b) => b - a })
}
