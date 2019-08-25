import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import DiscDetail, { Data } from './DiscDetail'

export default function DiscDetailOfId({match}: RouteComponentProps<{ id: string }>) {
  const [{error, data}, {loading}, {doEdit}] = useData<Data>(`/api/discs/${match.params.id}`)
  return <DiscDetail data={data} error={error} loading={loading} doEdit={doEdit}/>
}
