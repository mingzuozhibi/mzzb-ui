import { MyColumn, MyTable } from '#C/table/MyTable'
import { formatNumber } from '#U/format'
import { Link } from 'react-router-dom'
import './disc-table.scss'

import { linkToDisc, linkToRecords } from '#A/links'
import { IDisc } from '#T/disc'
import {
  compareJapan,
  comparePt,
  compareRank,
  compareRelease,
  compareTitle,
  discTitle,
  formatPt,
  fmtJapan,
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

export function DiscTable(props: Props) {
  const { name, rows, showJapan } = props
  const lastCols = showJapan ? japanCols : titleCols
  return (
    <div className="disc-table">
      <MyTable tag={name} rows={rows} cols={lastCols} defaultSort={compareRank} />
    </div>
  )
}

function buildColumns(): MyColumn<IDisc>[] {
  return [
    {
      key: 'index',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: '日亚排名',
      format: (row) => <Link to={linkToRecords(row.id)}>{discRank(row)}</Link>,
      compare: compareRank,
      tdClass: tdClassRank,
    },
    {
      key: 'today-pt',
      title: '日增',
      format: (row) => formatPt(row.todayPt),
      compare: comparePt((disc) => disc.todayPt),
    },
    {
      key: 'total-pt',
      title: '累积',
      format: (row) => formatPt(row.totalPt),
      compare: comparePt((disc) => disc.totalPt),
    },
    {
      key: 'guess-pt',
      title: '预测',
      format: (row) => formatPt(row.guessPt),
      compare: comparePt((disc) => disc.guessPt),
    },
    {
      key: 'release',
      title: '发售',
      format: (row) => `${row.surplusDays}天`,
      compare: compareRelease,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>,
      compare: compareTitle,
    },
    {
      key: 'japan',
      title: '日文标题',
      format: (row) => <Link to={linkToDisc(row.id)}>{fmtJapan(row.title)}</Link>,
      compare: compareJapan,
    },
  ]
}

function discRank(disc: IDisc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}
