export interface DiscList {
  title: string
  discs: Disc[]
  modifyTime?: number
}

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
  return titleString(a).localeCompare(titleString(b))
}

export function titleString(disc: Disc) {
  return disc.titlePc || disc.title
}
