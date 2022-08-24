import { useAppSelector } from '#A/hooks'
import { useData } from '#H/useData'
import { IDisc } from '#T/disc'
import { useParams } from 'react-router-dom'
import { DiscDetail } from './DiscDetail'

export default function DiscDetailOfAsin() {
  const params = useParams<{ asin: string }>()
  const theUse = useData<IDisc>(`/api/discs/asin/${params.asin}`)
  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  return <DiscDetail useDate={theUse} isBasic={hasBasic} />
}
