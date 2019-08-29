import { Disc } from './@types'

export function compareSurp(a: Disc, b: Disc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: Disc, b: Disc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export function discTitle(disc: Disc) {
  return disc.titlePc || disc.title
}
