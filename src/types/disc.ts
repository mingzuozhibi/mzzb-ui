export interface IGroup {
  id: number
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime?: number
}

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

export interface IComing {
  id: number
  asin: string
  type: string
  date?: string
  title: string
  tracked: boolean
  createOn: number
}

export interface IRecord {
  id: number
  date: string
  todayPt?: number
  totalPt?: number
  guessPt?: number
  averRank?: number
}

export interface IGroupCount extends IGroup {
  discCount: number
}

export interface IGroupDiscs extends IGroup {
  discs: IDisc[]
}

export interface IDiscRecords extends IDisc {
  records: IRecord[]
}
