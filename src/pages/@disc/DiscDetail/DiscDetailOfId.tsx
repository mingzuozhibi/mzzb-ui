import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { Data, DiscDetail } from './DiscDetail'
import { InjectRole, injectRole } from '../../@inject'

export default injectRole(DiscDetailOfId)

function DiscDetailOfId({isBasic, match}: InjectRole & RouteComponentProps<{ id: string }>) {
  const _useData = useData<Data>(`/api/discs/${match.params.id}`)
  return <DiscDetail useDate={_useData} isBasic={isBasic}/>
}
