export function linkToDisc(id: number) {
  return `/discs/${id}`
}

export function linkToRecords(id: number) {
  return `/discs/${id}/records`
}

export function linkToAsin(asin: string) {
  return `/discs/asin/${asin}`
}

export function linkToAmazon(asin: string) {
  return `https://www.amazon.co.jp/dp/${asin}`
}

export function linkToAmazonDeatil(asin: string) {
  return `https://www.amazon.co.jp/dp/${asin}#detailBullets_feature_div`
}

export function linkToGroup(key: string) {
  return `/disc_groups/${key}`
}

export function linkToGroupViewList(key: string) {
  return `/disc_groups/${key}/discs`
}

export function linkToGroupEditList(key: string) {
  return `/disc_groups/${key}/discs/edit`
}
