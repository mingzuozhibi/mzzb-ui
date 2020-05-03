import { RouteComponentProps } from 'react-router-dom'

export type RouteProps<T> = RouteComponentProps<T>

export interface Disc {
  id: number
  asin: string
  title: string
  titleCN?: string
  addPoint?: number
  sumPoint?: number
  powPoint?: number
  thisRank?: number
  prevRank?: number
  discType: string
  createOn: number
  updateOn?: number
  modifyOn?: number
  releaseDate?: string
  releaseDays?: number
}

export interface Group {
  id: number
  index: string
  title: string
  status: string
  update: string
  discCount: number
  lastUpdate: number
  updateDate: string
}
