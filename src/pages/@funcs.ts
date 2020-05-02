import { Disc } from './@types'
import { safeCompare } from '../funcs/compare'

export const compareSurp = safeCompare<Disc, number>({
  apply: (t) => t.releaseDays,
  compare: (a, b) => a - b
})

export function compareTitle(a: Disc, b: Disc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export function formatPt(pt?: number) {
  return pt === undefined ? '---' : `${pt} pt`
}

export function discTitle(disc: Disc) {
  return disc.titleCN || disc.title
}
