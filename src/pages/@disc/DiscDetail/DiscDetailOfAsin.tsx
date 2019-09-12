import React from 'react'
import { useData } from '../../../hooks/useData'
import { Data, DiscDetail } from './DiscDetail'
import { InjectRole, injectRole } from '../../@inject'
import { RouteProps } from '../../@types'

export default injectRole(DiscDetailOfAsin)

function DiscDetailOfAsin({isBasic, match}: InjectRole & RouteProps<{ asin: string }>) {
  const _useData = useData<Data>(`/api/discs/asin/${match.params.asin}`)
  return <DiscDetail useDate={_useData} isBasic={isBasic}/>
}
