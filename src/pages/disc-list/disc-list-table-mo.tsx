import { MinusOutlined, UpOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './disc-list-table-mo.scss'

import { linkToDisc, linkToRecords } from '#A/links'
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
          <div>&nbsp;</div>
          <div>#</div>
          <div>&nbsp;</div>
        </div>
      ),
      format: (row, idx) => idx + 1,
    },
    {
      key: 'rank',
      title: (
        <div>
          <div>当前</div>
          <div>
            <UpOutlined />
          </div>
          <div>前回</div>
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
          <div>日增</div>
          <div>累积</div>
          <div>预测</div>
        </div>
      ),
      format: (row) => (
        <div>
          <div>+{formatPt(row.todayPt)}</div>
          <div>{formatPt(row.totalPt)}</div>
          <div>{formatPt(row.guessPt)}</div>
        </div>
      ),
      compare: comparePt((disc) => disc.totalPt),
    },
    {
      key: 'release',
      title: (
        <div>
          <div>前回</div>
          <div>
            <MinusOutlined />
          </div>
          <div>类型</div>
        </div>
      ),
      format: (row) => (
        <div>
          <div>{row.surplusDays}天</div>
          <div>
            <MinusOutlined />
          </div>
          <div>{row.discType}</div>
        </div>
      ),
      compare: compareDisc,
    },
    {
      key: 'title',
      title: (
        <div>
          <div>&nbsp;</div>
          <div>碟片标题</div>
          <div>&nbsp;</div>
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
  return pt === undefined ? '--- pt' : `${pt} pt`
}

function comparePt(apply: (disc: IDisc) => number | undefined) {
  return safeCompare<IDisc, number>({ apply, compare: (a, b) => b - a })
}

function discRank(disc: IDisc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return (
    <div>
      <div>{thisRank}位</div>
      <div>
        <UpOutlined />
      </div>
      <div>{prevRank}位</div>
    </div>
  )
}
