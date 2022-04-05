import { useRouteMatch } from 'react-router-dom'
import { useData } from '../../../hooks/useData'
import { Data, Discs } from './Discs'

const columns =
  'id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays'

export default function DiscsOfDiscGroup() {
  const match = useRouteMatch<{ key: string }>()
  const { key } = match.params
  const [state, handler] = useData<Data>(`/api/discGroups/key/${key}/discs?discColumns=${columns}`)
  return (
    <div className="DiscsSakura">
      <Discs error={state.error} data={state.data} handler={handler} />
    </div>
  )
}
