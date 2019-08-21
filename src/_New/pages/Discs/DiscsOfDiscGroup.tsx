import React from 'react'
import { RouteComponentProps } from 'react-router'
import { useDocumentTitle } from '../../hooks/hooks'
import { useData } from '../../hooks/useData'
import { Data, Discs } from './Discs'

interface Params {
  key: string
}

const query = 'discColumns=id,asin,title,titlePc,thisRank,prevRank,todayPt,totalPt,guessPt,updateTime,surplusDays'

export default function DiscsOfDiscGroup({match}: RouteComponentProps<Params>) {
  const {key} = match.params
  const [state, handler] = useData<Data>(`/api/sakuras/key/${key}/discs?${query}`)

  useDocumentTitle(state.data ? state.data.title : '数据载入中')

  return (
    <div className="DiscsSakura">
      <Discs state={state} handler={handler}/>
    </div>
  )
}
