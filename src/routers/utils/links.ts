export function linkToGroups(link: string = '') {
  return `/disc_groups${link}`
}

export function linkToComing(link: string = '') {
  return `/disc_coming${link}`
}

export function linkToDiscs(link: string = '') {
  return `/discs${link}`
}

export function linkToUsers(link: string = '') {
  return `/users${link}`
}

export function linkToMsgs(link: string = '') {
  return `/console${link}`
}

export function linkToAmazon(asin: string) {
  return `https://www.amazon.co.jp/dp/${asin}`
}

export function linkToBullet(asin: string) {
  return `https://www.amazon.co.jp/dp/${asin}#detailBullets_feature_div`
}

export function apiToGroups(link: string = '') {
  return `/api/discGroups${link}`
}

export function apiToSpider(link: string = '') {
  return `/api/spider${link}`
}

export function apiToDiscs(link: string = '') {
  return `/api/discs${link}`
}

export function apiToUsers(link: string = '') {
  return `/api/users${link}`
}

export function apiToSession(link: string = '') {
  return `/api/session${link}`
}

export function apiToMsgs(link: string = '') {
  return `/api/messages${link}`
}
