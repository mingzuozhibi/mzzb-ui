import { useData } from '##/hooks'
import { useParams } from 'react-router-dom'
import Discs, { IGroup } from './Discs'

const columns =
  'id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays'

export default function DiscsOfDiscGroup() {
  const params = useParams<{ key: string }>()
  const [state, handler] = useData<IGroup>(
    `/api/discGroups/key/${params.key}/discs?discColumns=${columns}`
  )
  return (
    <div className="DiscsSakura">
      <Discs
        error={state.error}
        data={state.data}
        handler={handler}
        lowerKey={params.key.toLocaleLowerCase()}
      />
    </div>
  )
}
