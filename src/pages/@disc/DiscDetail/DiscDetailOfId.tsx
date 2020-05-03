import React from 'react'
import { useData } from '../../../hooks/useData'
import { Data, DiscDetail } from './DiscDetail'
import { InjectRole, injectRole } from '../../@inject'
import { RouteProps } from '../../@types'

export default injectRole(DiscDetailOfId)

function DiscDetailOfId({isDiscAdmin, match}: InjectRole & RouteProps<{ id: string }>) {
  const _useData = useData<Data>(`/api/discs/${match.params.id}`)
  return <DiscDetail useDate={_useData} isDiscAdmin={isDiscAdmin}/>
}
