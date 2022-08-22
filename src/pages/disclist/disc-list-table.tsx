import { MyColumn, MyTable } from '#C/table/MyTable'
import { IDisc } from '#T/disc'
import { composeCompares, safeCompare } from '#U/compare'
import { Link } from 'react-router-dom'
import './disc-list-table.scss'
import { discRank, discTitle } from './disc-utils'

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
      format: (_, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: '日亚排名',
      format: (disc) => <Link to={`/discs/${disc.id}/records`}>{discRank(disc)}</Link>,
      tdClass: tdClassRank,
      compare: compareRank(),
    },
    {
      key: 'today-pt',
      title: '日增',
      format: (disc) => formatPt(disc.todayPt),
      compare: comparePt((disc) => disc.todayPt),
    },
    {
      key: 'total-pt',
      title: '累积',
      format: (disc) => formatPt(disc.totalPt),
      compare: comparePt((disc) => disc.totalPt),
    },
    {
      key: 'guess-pt',
      title: '预测',
      format: (disc) => formatPt(disc.guessPt),
      compare: comparePt((disc) => disc.guessPt),
    },
    {
      key: 'release',
      title: '发售',
      format: (disc) => `${disc.surplusDays}天`,
      compare: composeCompares([compareRelease, compareTitle]),
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (disc) => <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>,
      compare: compareTitle,
    },
  ]
}

function tdClassRank(disc: IDisc) {
  if (disc.updateTime === undefined) return null
  const timeout = Date.now() - disc.updateTime
  if (timeout < 3600000) return 'success'
  if (timeout > 21960000) return 'warning'
  return null
}

function compareRank() {
  return safeCompare<IDisc, number>({
    apply: (disc) => disc.thisRank,
    compare: (a, b) => a - b,
  })
}

function formatPt(pt?: number) {
  return pt === undefined ? '---' : `${pt} pt`
}

function comparePt(apply: (disc: IDisc) => number | undefined) {
  return safeCompare<IDisc, number>({ apply, compare: (a, b) => b - a })
}

function compareRelease(a: IDisc, b: IDisc) {
  return a.surplusDays - b.surplusDays
}

function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}
