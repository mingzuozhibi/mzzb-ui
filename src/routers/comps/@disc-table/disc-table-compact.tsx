import { MzColumn, MzTable } from '#CC/table/MzTable'
import { Link } from 'react-router-dom'
import './disc-table-compact.scss'

import { IDisc } from '#DT/disc'
import { discJapan, discTitle, formatAddPt, formatPt, tdClassRank } from '#DU/disc-comps'
import { compareRelease, compareJapan, comparePt, compareRank, compareTitle } from '#DU/disc-utils'
import { formatNumber } from '#RU/format'
import { linkToDiscs } from '#RU/links'

interface Props {
  name: string
  rows?: IDisc[]
  sort?: 'rank' | 'none'
  outPage?: boolean
  hideCols: Array<'id' | 'idx' | 'title' | 'japan'>
}

const cols = buildColumns()

export function DiscTableCompact(props: Props) {
  const { name, rows, sort = 'rank', outPage, hideCols } = props
  const lastCols = cols.filter((col) => !hideCols.includes(col.key as any))
  const lastSort = sort === 'rank' ? compareRank : undefined
  return (
    <div className="disc-table-compact">
      <MzTable
        tag={`compact-${name}`}
        rows={rows}
        cols={lastCols}
        usePage={outPage !== true}
        defaultSort={lastSort}
      />
    </div>
  )
}

function buildColumns(): MzColumn<IDisc>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'id',
      title: 'ID',
      format: (row) => row.id,
    },
    {
      key: 'rank',
      title: (
        <div>
          <div>当前</div>
          <div>前回</div>
        </div>
      ),
      format: (row) => <Link to={linkToDiscs(`/${row.id}/records`)}>{discRank(row)}</Link>,
      tdClass: tdClassRank,
      compare: compareRank,
    },
    {
      key: 'point',
      title: (
        <div>
          <div>日增</div>
          <div>累积</div>
        </div>
      ),
      format: (row) => (
        <div>
          <div>{formatAddPt(row.todayPt)}</div>
          <div>{formatPt(row.totalPt)}</div>
        </div>
      ),
      compare: comparePt((disc) => disc.totalPt),
    },
    {
      key: 'release',
      title: (
        <div>
          <div>发售</div>
          <div>预测</div>
        </div>
      ),
      format: (row) => (
        <div>
          <div>{row.surplusDays}天</div>
          <div>{formatPt(row.guessPt)}</div>
        </div>
      ),
      compare: compareRelease,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <Link to={linkToDiscs(`/${row.id}`)}>{discTitle(row)}</Link>,
      compare: compareTitle,
    },
    {
      key: 'japan',
      title: '日文标题',
      format: (row) => <Link to={linkToDiscs(`/${row.id}`)}>{discJapan(row)}</Link>,
      compare: compareJapan,
    },
  ]
}

function discRank(disc: IDisc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return (
    <div>
      <div>{thisRank}位</div>
      <div>{prevRank}位</div>
    </div>
  )
}
