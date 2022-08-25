import { MyColumn, MyTable } from '#C/table/MyTable'
import { formatNumber } from '#U/format'
import { Link } from 'react-router-dom'
import './disc-list-table-mo.scss'

import { linkToDisc, linkToRecords } from '#A/links'
import { IDisc } from '#T/disc'
import {
  comparePt,
  compareRank,
  compareRelease,
  compareTitle,
  discTitle,
  formatPt,
  tdClassRank,
} from '#T/disc-utils'

interface Props {
  name: string
  rows: IDisc[]
}

const cols = buildColumns()

export function DiscListTableMo(props: Props) {
  const { name, rows } = props
  return (
    <div className="disc-list-table-mo">
      <MyTable tag={name} rows={rows} cols={cols} defaultSort={compareRank} />
    </div>
  )
}

function buildColumns(): MyColumn<IDisc>[] {
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
      format: (row) => <Link to={linkToRecords(row.id)}>{discRank(row)}</Link>,
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
          <div>+{formatPt(row.todayPt)}</div>
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
      format: (row) => <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>,
      compare: compareTitle,
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
