export interface Disc {
  id: number
  asin: string
  title: string
  titlePc?: string
  thisRank?: number
  prevRank?: number
  todayPt?: number
  totalPt?: number
  guessPt?: number
  updateTime?: number
  surplusDays: number
}

export function compareSurp(a: Disc, b: Disc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: Disc, b: Disc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export function discTitle(disc: Disc) {
  return disc.titlePc || disc.title
}
