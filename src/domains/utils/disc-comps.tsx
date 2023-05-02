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

export function discTitle(disc: IDisc, useSwap?: boolean) {
  // use || check null undefined and empty
  return disc.titlePc?.trim() || discJapan(disc, useSwap)
}

const swapTexts = [
  '【Amazon.co.jp限定】',
  '【Amazon.co.jp限定】',
  '【メーカー特典あり】',
  '【早期予約特典】',
  '【セット購入用】',
  '【初回生産限定】',
  '【通常版】',
  '【DVD】',
  '【BD】',
]

export function discJapan(disc: IDisc, useSwap: boolean = false) {
  let title = disc.title
  if (useSwap) {
    for (const text of swapTexts) {
      const start = title.indexOf(text)
      const end = start + text.length
      if (start >= 0) {
        title = title.slice(0, start) + title.slice(end) + text
      }
    }
  }
  return title
}

export function amazonLink(asin?: string) {
  return safeWarpper(asin, (asin) => {
    return <MzLink href={linkToBullet(asin)} title="日亚链接" />
  })
}
