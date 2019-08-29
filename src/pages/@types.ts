export interface User {
  id: number
  enabled: boolean
  username: string
  registerDate: string
  lastLoggedIn: string | undefined
}

export interface Disc {
  id: number
  asin: string
  title: string
  titlePc?: string
  todayPt?: number
  totalPt?: number
  guessPt?: number
  thisRank?: number
  prevRank?: number
  nicoBook?: number
  discType: string
  createTime: number
  updateTime?: number
  modifyTime?: number
  releaseDate: string
  surplusDays: number
}

export interface DiscGroup {
  id: number
  key: string
  title: string
  enabled: boolean
  viewType: string
  discCount: number
  modifyTime: number
}

export const viewTypes = [
  {label: '日亚实时', value: 'SakuraList'},
  {label: '公开列表', value: 'PublicList'},
  {label: '私有列表', value: 'PrivateList'},
]
