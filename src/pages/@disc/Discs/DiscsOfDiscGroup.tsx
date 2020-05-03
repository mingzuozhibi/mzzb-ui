import React, { useState } from 'react'
import { useData } from '../../../hooks/useData'
import { RouteProps } from '../../@types'
import { Data, Discs } from './Discs'

export interface PageParams {
  page?: number
  size?: number
  sort?: string[]
}

export default function DiscsOfDiscGroup({ match }: RouteProps<{ index: string }>) {
  const [{page, size, sort}, setParams] = useState<PageParams>({ page: 1, size: 50, sort: [] })
  const { index } = match.params
  const query = `page=${page}&size=${size}&${sort?.map(e=>'sort='+e).join(',')}`
  const uri = `/api/groups/find/index/${index}/with/discs?${query}`
  const [state, handler] = useData<Data>(uri)
  return (
    <div className="DiscsSakura">
      <Discs
        error={state.error}
        data={state.data}
        page={state.page}
        handler={handler}
        setPageParams={setParams}
      />
    </div>
  )
}
