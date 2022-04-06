import { useParams } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { InjectRole, injectRole } from '../../@inject'
import { Data, DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfAsin)

function DiscDetailOfAsin({ isBasic }: InjectRole) {
  const params = useParams<{ asin: string }>()
  const theUse = useData<Data>(`/api/discs/asin/${params.asin}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
