import { IDisc } from '#T/disc'
import { composeCompares } from '#U/compare'

export function discTitle(disc: IDisc) {
  return disc.titlePc || disc.title
}

export function compareRelease(a: IDisc, b: IDisc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export const compareDisc = composeCompares<IDisc>([compareRelease, compareTitle])
