import { IDisc } from '#T/disc'
import { formatNumber } from '#U/format'

export function discRank(disc: IDisc) {
  const thisRank = disc.thisRank ? formatNumber(disc.thisRank, '****') : '----'
  const prevRank = disc.prevRank ? formatNumber(disc.prevRank, '****') : '----'
  return `${thisRank}位/${prevRank}位`
}

export function discTitle(disc: IDisc) {
  return disc.titlePc || disc.title
}
