import { MzColumn } from '#C/table/MzTable'
import { thenCompare } from '#U/compare'
import { Link } from 'react-router-dom'

import { linkToDisc } from '#A/links'
import { IDisc } from '#T/disc'
import { discTitle } from '#T/disc-utils'

export function buildColumns(extraColumn: MzColumn<IDisc>): MzColumn<IDisc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (row) => row.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin),
    },
    {
      key: 'release',
      title: '天数',
      format: (row) => `${row.surplusDays}天`,
      compare: compareRelease,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>,
      compare: compareTitle,
    },
    extraColumn,
  ]
}

const compareRelease = thenCompare<IDisc>(compareSurplus, compareTitle)

function compareSurplus(a: IDisc, b: IDisc) {
  return b.surplusDays - a.surplusDays
}

function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}
