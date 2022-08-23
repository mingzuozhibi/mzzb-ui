import { MinusOutlined, UpOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './disc-list-table-mo.scss'

import { linkToDisc, linkToRecords } from '#A/routes'
import { MyColumn, MyTable } from '#C/table/MyTable'
import { IDisc } from '#T/disc'
import { safeCompare } from '#U/compare'
import { formatNumber } from '#U/format'

import { compareDisc, compareTitle, discTitle } from './disc-utils'

interface Props {
  name: string
  rows: IDisc[]
}

const cols = buildColumns()

export function DiscListTableMo(props: Props) {
  const { name, rows } = props
  return (
    <div className="disc-list-table-mo">
      <MyTable name={name} rows={rows} cols={cols} defaultSort={compareRank()} />
    </div>
  )
}

function buildColumns(): MyColumn<IDisc>[] {
  return [
    {
      key: 'index',
      title: (
        <div>
          &nbsp;
          <br />
          #
          <br />
          &nbsp;
        </div>
      ),
      format: (row, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: (
        <div>
          当前
          <br />
          <UpOutlined />
          <br />
          前回
        </div>
      ),
      format: (row) => <Link to={linkToRecords(row.id)}>{discRank(row)}</Link>,
      tdClass: tdClassRank,
      compare: compareRank(),
    },
    {
      key: 'point',
      title: (
        <div>
          日增
          <br />
          累积
          <br />
          预测
        </div>
      ),
      format: (row) => (
        <div>
          +{formatPt(row.todayPt)}
          <br />
          {formatPt(row.totalPt)}
          <br />
          {formatPt(row.guessPt)}
        </div>
      ),
      compare: comparePt((disc) => disc.totalPt),
    },
    {
      key: 'release',
      title: (
        <div>
          发售
          <br />
          <MinusOutlined />
          <br />
          类型
        </div>
      ),
      format: (row) => (
        <div>
          {row.surplusDays}天
          <br />
          <MinusOutlined />
          <br />
          {row.discType}
        </div>
      ),
      compare: compareDisc,
    },
    {
      key: 'title',
      title: (
        <div>
          &nbsp;
          <br />
          碟片标题
          <br />
          &nbsp;
        </div>
      ),
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

function discRank(disc: IDisc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return (
    <div>
      {thisRank}位
      <br />
      <UpOutlined />
      <br />
      {prevRank}位
    </div>
  )
}
