import { useData } from '#H/useData'
import { InjectRole, injectRole } from '#P/@inject'
import { IDisc } from '#T/disc'
import { useParams } from 'react-router-dom'
import { DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfAsin)

function DiscDetailOfAsin({ isBasic }: InjectRole) {
  const params = useParams<{ asin: string }>()
  const theUse = useData<IDisc>(`/api/discs/asin/${params.asin}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
