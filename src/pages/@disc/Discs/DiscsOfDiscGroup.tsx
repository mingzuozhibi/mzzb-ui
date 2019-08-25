import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useTitle } from '../../../hooks/hooks'
import { useData } from '../../../hooks/useData'
import { Data, Discs } from './Discs'

const query = 'discColumns=id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays'

export default function DiscsOfDiscGroup({match}: RouteComponentProps<{ key: string }>) {
  const {key} = match.params
  const [state, handler] = useData<Data>(`/api/sakuras/key/${key}/discs?${query}`)

  useTitle(state.data ? state.data.title : '数据载入中')

  return (
    <div className="DiscsSakura">
      <Discs error={state.error} data={state.data} handler={handler}/>
    </div>
  )
}
