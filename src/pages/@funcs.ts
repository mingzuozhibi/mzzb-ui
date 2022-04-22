import { Disc } from '#P/@types'

export function compareSurp(a: Disc, b: Disc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: Disc, b: Disc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export function formatPt(pt?: number) {
  return pt === undefined ? '---' : `${pt} pt`
}

export function discTitle(disc: Disc) {
  return disc.titlePc || disc.title
}
