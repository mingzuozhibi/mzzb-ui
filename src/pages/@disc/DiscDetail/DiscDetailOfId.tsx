import { useData } from '#H/useData'
import { InjectRole, injectRole } from '#P/@inject'
import { IDisc } from '#T/disc'
import { useParams } from 'react-router-dom'
import { DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfId)

function DiscDetailOfId({ isBasic }: InjectRole) {
  const params = useParams<{ id: string }>()
  const theUse = useData<IDisc>(`/api/discs/${params.id}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
