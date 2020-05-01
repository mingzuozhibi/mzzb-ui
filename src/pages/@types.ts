import { RouteComponentProps } from 'react-router-dom'

export type RouteProps<T> = RouteComponentProps<T>

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
  index: string
  title: string
  status: string
  update: string
  discCount: number
  lastUpdate: number
  updateDate: string
}
