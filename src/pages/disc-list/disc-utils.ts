import { IDisc } from '#T/disc'
import { composeCompares } from '#U/compare'
import { formatNumber } from '#U/format'

export function discRank(disc: IDisc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

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
