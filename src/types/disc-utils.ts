import { IDisc } from '#T/disc'
import { safeCompare, thenCompare } from '#U/compare'

export const compareRank = safeCompare<IDisc, number>(
  (row) => row.thisRank,
  (a, b) => a - b
)

export function tdClassRank(row: IDisc) {
  if (row.updateTime === undefined) return null
  const timeout = Date.now() - row.updateTime
  if (timeout < 3600000) return 'success'
  if (timeout > 21960000) return 'warning'
  return null
}

export function comparePt(apply: (disc: IDisc) => number | undefined) {
  return safeCompare(apply, (a, b) => b - a)
}

export function formatAddPt(pt?: number) {
  return pt === undefined ? '--- pt' : `+${pt} pt`
}

export function formatPt(pt?: number) {
  return pt === undefined ? '--- pt' : `${pt} pt`
}

export const compareRelease = thenCompare<IDisc>(compareSurplus, compareTitle)

export function compareSurplus(a: IDisc, b: IDisc) {
  return a.surplusDays - b.surplusDays
}

export function compareTitle(a: IDisc, b: IDisc) {
  return discTitle(a).localeCompare(discTitle(b))
}

export function discTitle(disc: IDisc) {
  // use || check null undefined and empty
  return mapTitle(disc.titlePc || disc.title)
}

export function mapTitle(title: string) {
  const regex = /^(【[^】]+】)(.+)$/
  const exec = regex.exec(title)
  if (exec) return exec[2] + exec[1]
  return title
}

export const compareJapan = safeCompare(
  (row: IDisc) => mapTitle(row.title),
  (a, b) => a.localeCompare(b)
)
