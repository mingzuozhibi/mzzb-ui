import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import DiscDetail, { Data } from './DiscDetail'

export default function DiscDetailOfAsin({match}: RouteComponentProps<{ asin: string }>) {
  const [{error, data}, {loading}, {doEdit}] = useData<Data>(`/api/discs/asin/${match.params.asin}`)
  return <DiscDetail data={data} error={error} loading={loading} doEdit={doEdit}/>
}
