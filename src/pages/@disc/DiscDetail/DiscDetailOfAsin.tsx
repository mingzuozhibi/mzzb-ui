import React from 'react'
import { useData } from '../../../hooks/useData'
import { RouteProps } from '../../@types'
import { Data, DiscDetail } from './DiscDetail'

export default function DiscDetailOfAsin({ match }: RouteProps<{ asin: string }>) {
  const _useData = useData<Data>(`/api/discs/asin/${match.params.asin}`)
  return <DiscDetail useDate={_useData} />
}
