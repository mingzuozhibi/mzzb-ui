import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useData } from '../../hooks/useData'
import { Disc } from './DiscDetail'
import DiscDetail from './index'

export default function DiscDetailOfId({match}: RouteComponentProps<{ id: string }>) {
  const [{error, data}, {loading}, {doEdit}] = useData<Disc>(`/api/discs/${match.params.id}`)
  return <DiscDetail data={data} error={error} loading={loading} doEdit={doEdit}/>
}
