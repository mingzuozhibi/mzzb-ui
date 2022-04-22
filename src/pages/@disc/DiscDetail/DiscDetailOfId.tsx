import { useData } from '##/hooks'
import { InjectRole, injectRole } from '#P/@inject'
import { useParams } from 'react-router-dom'
import { Data, DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfId)

function DiscDetailOfId({ isBasic }: InjectRole) {
  const params = useParams<{ id: string }>()
  const theUse = useData<Data>(`/api/discs/${params.id}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
