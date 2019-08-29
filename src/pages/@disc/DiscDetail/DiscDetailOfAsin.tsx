import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { Data, DiscDetail } from './DiscDetail'
import { InjectRole, injectRole } from '../../@inject'

export default injectRole(DiscDetailOfAsin)

function DiscDetailOfAsin({isBasic, match}: InjectRole & RouteComponentProps<{ asin: string }>) {
  const _useData = useData<Data>(`/api/discs/asin/${match.params.asin}`)
  return <DiscDetail useDate={_useData} isBasic={isBasic}/>
}
