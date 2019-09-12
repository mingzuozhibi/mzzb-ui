import React from 'react'
import { useData } from '../../hooks/useData'
import { Column, Table } from '../../comps/@table/Table'
import { RouteComponentProps } from 'react-router'
import { CustomPagination } from '../../comps/CustomPagination'

interface Data {
  id: number
  type: 'info' | 'warn',
  text: string,
  createOn: number,
  acceptOn: number,
}

export default function Console({location, history, match}: RouteComponentProps<{name: string}>) {

  const [{data, page}, handler] = useData<Data[]>(`/gateway/moduleMessages/${match.params.name}${location.search}`)

  data && data.forEach((d, i) => {
    d.id = i
  })

  const cols: Column<Data>[] = [
    {
      key: 'time',
      title: '时间',
      format: t => new Date(t.createOn).toLocaleString()
    },
    {
      key: 'text',
      title: '消息',
      format: t => t.text
    },
  ]

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      history.push(`/console?page=${page}`)
    } else {
      history.push(`/console?page=${page}&pageSize=${pageSize}`)
    }
  }

  return (
    <div className="Console">
      {data && (
        <Table
          title="系统日志"
          cols={cols}
          rows={data}
          handler={handler}
          trClass={(t: Data) => ({'warning': t.type === 'warn'})}
        />
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange}/>
      )}
    </div>
  )
}
