import { Link } from 'react-router-dom'
import './disc-list-table.scss'

import { linkToDisc, linkToRecords } from '#A/routes'
import { MyColumn, MyTable } from '#C/table/MyTable'
import { IDisc } from '#T/disc'
import { safeCompare } from '#U/compare'

import { compareDisc, compareTitle, discRank, discTitle } from './disc-utils'

interface Props {
  name: string
  rows: IDisc[]
}

const cols = buildColumns()

export function DiscListTable(props: Props) {
  const { name, rows } = props
  return (
    <div className="disc-list-table">
      <MyTable name={name} rows={rows} cols={cols} defaultSort={compareRank()} />
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
      tdClass: tdClassRank,
      compare: compareRank(),
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
      compare: compareDisc,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>,
      compare: compareTitle,
    },
  ]
}

function tdClassRank(row: IDisc) {
  if (row.updateTime === undefined) return null
  const timeout = Date.now() - row.updateTime
  if (timeout < 3600000) return 'success'
  if (timeout > 21960000) return 'warning'
  return null
}

function compareRank() {
  return safeCompare<IDisc, number>({
    apply: (row) => row.thisRank,
    compare: (a, b) => a - b,
  })
}

function formatPt(pt?: number) {
  return pt === undefined ? '---' : `${pt} pt`
}

function comparePt(apply: (disc: IDisc) => number | undefined) {
  return safeCompare<IDisc, number>({ apply, compare: (a, b) => b - a })
}
