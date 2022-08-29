import { IDisc } from '#T/disc'
import { safeCompare, thenCompare } from '#U/compare'
import { isJustUpdate, isLazyUpdate } from '#U/date/check'

export const compareRank = safeCompare<IDisc, number>(
  (row) => row.thisRank,
  (a, b) => a - b
)

export function tdClassRank(row: IDisc) {
  return {
    success: isJustUpdate(row.updateTime, 1),
    warning: isLazyUpdate(row.updateTime, 6),
  }
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
  return disc.titlePc?.trim() || fmtJapan(disc.title)
}

export function fmtJapan(title: string) {
  const regex = /^(【[^】]+】)(.+)$/
  const exec = regex.exec(title)
  if (exec) return exec[2] + exec[1]
  return title
}

export const compareJapan = safeCompare(
  (row: IDisc) => fmtJapan(row.title),
  (a, b) => a.localeCompare(b)
)
