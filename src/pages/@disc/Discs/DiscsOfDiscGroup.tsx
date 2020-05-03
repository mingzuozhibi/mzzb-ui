import React, { useState } from 'react'
import { useData } from '../../../hooks/useData'
import { RouteProps } from '../../@types'
import { Data, Discs } from './Discs'
import { Radio } from 'antd'

export interface PageParams {
  page?: number
  size?: number
  sort?: string[]
}

export default function DiscsOfDiscGroup({ match }: RouteProps<{ index: string }>) {
  const [{ page, size, sort }, setParams] = useState<PageParams>({ page: 1, size: 50, sort: ['rank', 'title'] })
  const { index } = match.params
  const query = `page=${page}&size=${size}&${sort?.map(e => 'sort=' + e).join('&')}`
  const uri = `/api/groups/find/index/${index}/with/discs?${query}`
  const [state, handler] = useData<Data>(uri)
  const sortButtos = (
    <Radio.Group defaultValue="rank,title" onChange={(e => {
      setParams({ page, size, sort: e.target.value.split(',') })
    })}>
      <Radio.Button value="rank,title">排名</Radio.Button>
      <Radio.Button value="date,title">日期</Radio.Button>
      <Radio.Button value="title">标题</Radio.Button>
    </Radio.Group>
  )

  const setPageParams = ({ page, size }: PageParams) => {
    setParams({ page, size, sort })
  }

  return (
    <div className="DiscsSakura">
      <Discs
        error={state.error}
        data={state.data}
        page={state.page}
        handler={handler}
        sortButtos={sortButtos}
        setPageParams={setPageParams}
      />
    </div>
  )
}
