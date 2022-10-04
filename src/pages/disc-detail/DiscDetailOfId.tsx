import { apiToDiscs } from '#A/links'
import { useParams } from 'react-router-dom'
import { DiscDetail } from './disc-detail'

export default function DiscDetailOfId() {
  const params = useParams<{ id: string }>()
  const discId = params.id as string
  return <DiscDetail url={apiToDiscs(`/${discId}`)} />
}
