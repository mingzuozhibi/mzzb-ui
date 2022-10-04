import { linkToBullet } from '#A/links'
import { MzLink } from '#C/link/MzLink'
import { safeWarpper } from '#U/domain'
import { IDisc } from './disc'

export function amazonLink(asin?: string) {
  return safeWarpper(asin, (asin) => <MzLink href={linkToBullet(asin)} title="日亚链接" />)
}

export function discTitle(disc: IDisc) {
  // use || check null undefined and empty
  return disc.titlePc?.trim() || discJapan(disc)
}

export function discJapan(disc: IDisc) {
  const regex = /^(【[^】]+】)(.+)$/
  const exec = regex.exec(disc.title)
  if (exec) return exec[2] + exec[1]
  return disc.title
}
