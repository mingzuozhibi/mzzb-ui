import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import classNames from 'classnames'

import { Handler, Page } from '../../../reducers/@domain'
import { Column, Table } from '../../../comps/@table/Table'
import { CustomHeader } from '../../../comps/CustomHeader'
import { CustomMessage } from '../../../comps/CustomMessage'

import { formatNumber, formatTimeout } from '../../../funcs/format'
import { isJustUpdated, isSlowUpdated } from '../../../funcs/domain'
import { composeCompares, safeCompare } from '../../../funcs/compare'
import { compareSurp, compareTitle, discTitle, formatPt } from '../../@funcs'
import { Disc } from '../../@types'
import './Discs.scss'
import { PageParams } from './DiscsOfDiscGroup'
import { CustomPagination } from '../../../comps/CustomPagination'

export interface Data {
  title: string
  discs: Disc[]
  lastUpdate?: number
}

interface Props {
  data?: Data
  page?: Page
  error?: string
  handler: Handler
  sortButtos: React.ReactNode
  setPageParams: (PageParams: PageParams) => void
}

const message = '点击复制按钮可进入复制模式，选中想要复制的碟片，然后再次点击复制即可将排名复制到剪贴板'

export function Discs(props: Props) {

  const { error, data, page, handler, sortButtos, setPageParams } = props
  const [pcMode, setPcMode] = useState(false)
  const title = data ? data.title : '载入中'

  const replace = data && (
    <>
      {data.lastUpdate && (
        <span>更新于{formatTimeout(data.lastUpdate)}前</span>
      )}
      <Button onClick={() => setPcMode(!pcMode)}>
        {pcMode ? '智能隐藏列' : '显示所有列'}
      </Button>
      {sortButtos}
    </>
  )

  function onPaginationChange(page: number, size: number = 50) {
    setPageParams({ page, size, sort: [] })
    window.scroll(0, 0)
  }

  return (
    <div className="Discs">
      <CustomMessage unikey="copymode" message={message} />
      <CustomHeader header="载入中" title={title} error={error} replace={replace} />
      {page && (
        <div style={{ marginBottom: 10 }}>
          <CustomPagination page={page} onChange={onPaginationChange} />
        </div>
      )}
      {data && page && (
        <>
          <div className="pc-mode-warpper">
            <div className={classNames({ 'pc-mode': pcMode })}>
              <Table
                rows={data.discs}
                cols={getColumns(page)}
                title={data.title}
                handler={handler}
                copyFmt={((disc, idx) => {
                  return `${idx + 1})`
                    + ` ${discRank(disc)}`
                    + ` 增${(disc.addPoint || 0)}pt`
                    + ` 共${(disc.sumPoint || 0)}pt`
                    + ` 预${(disc.powPoint || 0)}pt`
                    + ` 剩${disc.releaseDays}天`
                    + ` [${discTitle(disc)}]`
                })}
              />
            </div>
          </div>
        </>
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange} />
      )}
    </div>
  )

}

function getColumns(page: Page): Column<Disc>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: getPagedIndex(page),
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
      format: (disc) => formatPt(disc.addPoint),
      compare: createComparePt(disc => disc.addPoint),
    },
    {
      key: 'sumPt',
      title: '累积',
      format: (disc) => formatPt(disc.sumPoint),
      compare: createComparePt(disc => disc.sumPoint),
    },
    {
      key: 'gusPt',
      title: '预测',
      format: (disc) => formatPt(disc.powPoint),
      compare: createComparePt(disc => disc.powPoint),
    },
    {
      key: 'surp',
      title: '发售',
      format: formatSurp,
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

function getPagedIndex(page: Page): (row: Disc, idx: number) => React.ReactNode {
  return (_, idx) => idx + page.pageSize * (page.currentPage - 1) + 1
}

function discRank(disc: Disc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

function formatRank(disc: Disc) {
  return <Link to={`/discs/${disc.id}/records`}>{discRank(disc)}</Link>
}

function formatSurp(disc: Disc) {
  if (disc.releaseDays) {
    return `${disc.releaseDays}天`
  } else {
    return `未知`
  }
}

function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>
}

function tdClassRank(disc: Disc) {
  if (isJustUpdated(disc.updateOn)) {
    return 'success'
  }
  if (isSlowUpdated(disc.updateOn)) {
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
  return safeCompare<Disc, number>({ apply, compare: (a, b) => b - a })
}

