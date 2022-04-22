import { useData } from '##/hooks'
import { InjectRole, injectRole } from '#P/@inject'
import { useParams } from 'react-router-dom'
import { Data, DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfAsin)

function DiscDetailOfAsin({ isBasic }: InjectRole) {
  const params = useParams<{ asin: string }>()
  const theUse = useData<Data>(`/api/discs/asin/${params.asin}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
