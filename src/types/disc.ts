export interface IDisc {
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

export interface IGroup {
  id: number
  key: string
  title: string
  enabled: boolean
  viewType: string
  discCount: number
  modifyTime: number
}

export interface IGroupItems extends Omit<IGroup, 'discCount'> {
  discs: IDisc[]
}
