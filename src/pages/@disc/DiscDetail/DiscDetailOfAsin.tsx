import { useRouteMatch } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { InjectRole, injectRole } from '../../@inject'
import { Data, DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfAsin)

function DiscDetailOfAsin({ isBasic }: InjectRole) {
  const match = useRouteMatch<{ asin: string }>()
  const theUse = useData<Data>(`/api/discs/asin/${match.params.asin}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
