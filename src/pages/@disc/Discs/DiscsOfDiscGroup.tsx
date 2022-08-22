import { useData } from '#H/useData'
import { IGroupItems } from '#T/disc'
import { useParams } from 'react-router-dom'
import Discs from './Discs'

export default function DiscsOfDiscGroup() {
  const params = useParams<{ key: string }>()

  const [state, handler] = useData<IGroupItems>(`/api/discGroups/key/${params.key}/discs`)
  return (
    <div className="DiscsOfDiscGroup">
      <Discs
        error={state.error}
        data={state.data}
        handler={handler}
        lowerKey={params.key!.toLocaleLowerCase()}
      />
    </div>
  )
}
