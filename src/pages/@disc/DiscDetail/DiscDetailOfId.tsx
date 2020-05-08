import React from 'react'
import { useData } from '../../../hooks/useData'
import { RouteProps } from '../../@types'
import { Data, DiscDetail } from './DiscDetail'

export default function DiscDetailOfId({ match }: RouteProps<{ id: string }>) {
  const _useData = useData<Data>(`/api/discs/${match.params.id}`)
  return <DiscDetail useDate={_useData} />
}
