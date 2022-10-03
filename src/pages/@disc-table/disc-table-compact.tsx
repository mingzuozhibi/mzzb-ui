import { MzColumn, MzTable } from '#C/table/MzTable'
import { formatNumber } from '#U/format'
import { Link } from 'react-router-dom'
import './disc-table-compact.scss'

import { linkToDiscs } from '#A/links'
import { IDisc } from '#T/disc'
import {
  compareJapan,
  comparePt,
  compareRank,
  compareRelease,
  compareTitle,
  discTitle,
  fmtJapan,
  formatAddPt,
  formatPt,
  tdClassRank,
} from '#T/disc-utils'

interface Props {
  name: string
  rows: IDisc[]
  showJapan: boolean
}

const cols = buildColumns()
const titleCols = cols.filter((c) => c.key !== 'japan')
const japanCols = cols.filter((c) => c.key !== 'title')

export function DiscTableCompact(props: Props) {
  const { name, rows, showJapan } = props
  const lastCols = showJapan ? japanCols : titleCols
  return (
    <div className="disc-table-compact">
      <MzTable tag={`compact-${name}`} rows={rows} cols={lastCols} defaultSort={compareRank} />
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
      format: (row) => <Link to={linkToDiscs(`/${row.id}`)}>{fmtJapan(row.title)}</Link>,
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
