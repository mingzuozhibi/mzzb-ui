import { useRouteMatch } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { InjectRole, injectRole } from '../../@inject'
import { Data, DiscDetail } from './DiscDetail'

export default injectRole(DiscDetailOfId)

function DiscDetailOfId({ isBasic }: InjectRole) {
  const match = useRouteMatch<{ id: string }>()
  const theUse = useData<Data>(`/api/discs/${match.params.id}`)
  return <DiscDetail useDate={theUse} isBasic={isBasic} />
}
