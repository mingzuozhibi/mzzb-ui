import { MzLink } from '#CC/link/MzLink'
import { safeWarpper } from '#CU/empty'
import { IDisc } from '#DT/disc'
import { isJustUpdate, isLazyUpdate } from '#RU/check'
import { linkToBullet } from '#RU/links'

export function formatAddPt(pt?: number) {
  return pt === undefined ? '--- pt' : `+${pt} pt`
}

export function formatPt(pt?: number) {
  return pt === undefined ? '--- pt' : `${pt} pt`
}

export function tdClassRank(row: IDisc) {
  return {
    success: isJustUpdate(row.updateTime, 1),
    warning: isLazyUpdate(row.updateTime, 6) && isJustUpdate(row.updateTime, 24),
  }
}

export function discTitle(disc: IDisc) {
  // use || check null undefined and empty
  return disc.titlePc?.trim() || discJapan(disc)
}

export function discJapan(disc: IDisc) {
  const regex = /^((【[^【】]+】)+)(.+)$/
  const exec = regex.exec(disc.title)
  if (exec) return exec[3] + exec[1]
  return disc.title
}

export function amazonLink(asin?: string) {
  return safeWarpper(asin, (asin) => {
    return <MzLink href={linkToBullet(asin)} title="日亚链接" />
  })
}
