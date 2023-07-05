import { composeCompares, safeCompare } from '#CU/compare'
import { IDisc } from '#DT/disc'
import { discJapan, discTitle } from './disc-comps'

export const compareRank = safeCompare<IDisc, number>(
  (row) => row.thisRank,
  (a, b) => a - b
)

export function comparePt(apply: (disc: IDisc) => number | undefined) {
  return safeCompare(apply, (a, b) => b - a)
}

export function compareSurplus(a: IDisc, b: IDisc) {
  return a.surplusDays - b.surplusDays
}

export const compareTitle = safeCompare(
  (row: IDisc) => discTitle(row, true),
  (a, b) => a.localeCompare(b)
)

export const compareJapan = safeCompare(
  (row: IDisc) => discJapan(row, true),
  (a, b) => a.localeCompare(b)
)

export const compareRelease = composeCompares<IDisc>(compareSurplus, compareTitle)
