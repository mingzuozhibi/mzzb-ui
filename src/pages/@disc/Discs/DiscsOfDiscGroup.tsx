import React from 'react'
import { useData } from '../../../hooks/useData'
import { RouteProps } from '../../@types'
import { Data, Discs } from './Discs'

export default function DiscsOfDiscGroup({ match }: RouteProps<{ index: string }>) {
  const { index } = match.params
  const [state, handler] = useData<Data>(`/api/groups/find/index/${index}/with/discs`)
  return (
    <div className="DiscsSakura">
      <Discs error={state.error} data={state.data} handler={handler} />
    </div>
  )
}
