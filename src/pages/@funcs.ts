import { IDisc } from "#T/disc"

export function compareSurp(a: IDisc, b: IDisc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export function formatPt(pt?: number) {
  return pt === undefined ? '---' : `${pt} pt`
}

export function discTitle(disc: IDisc) {
  return disc.titlePc || disc.title
}
