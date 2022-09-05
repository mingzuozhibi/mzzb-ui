import { useParams } from 'react-router-dom'
import { DiscDetail } from './disc-detail'

export default function DiscDetailOfAsin() {
  const params = useParams<{ asin: string }>()
  const discAsin = params.asin as string
  return <DiscDetail url={`/api/discs/asin/${discAsin}`} />
}