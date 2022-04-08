import { useParams } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { Data, Discs } from './Discs'

const columns =
  'id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays'

export default function DiscsOfDiscGroup() {
  const params = useParams<{ key: string }>()
  const [state, handler] = useData<Data>(
    `/api/discGroups/key/${params.key}/discs?discColumns=${columns}`
  )
  return (
    <div className="DiscsSakura">
      <Discs error={state.error} data={state.data} handler={handler} />
    </div>
  )
}
