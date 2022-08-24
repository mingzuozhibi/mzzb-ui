import { IDisc } from '#T/disc'
import { composeCompares } from '#U/compare'

export function formatPt(pt?: number) {
  return pt === undefined ? '---' : `${pt} pt`
}

export function discTitle(disc: IDisc) {
  return disc.titlePc || disc.title
}

export function compareSurplus(a: IDisc, b: IDisc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export const compareRelease = composeCompares<IDisc>([compareSurplus, compareTitle])
