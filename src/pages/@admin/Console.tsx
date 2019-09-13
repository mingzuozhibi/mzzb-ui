import React from 'react'
import { Alert } from 'antd'
import { useData } from '../../hooks/useData'
import { formatNumber } from '../../funcs/format'
import { Column, Table } from '../../comps/@table/Table'
import { CustomPagination } from '../../comps/CustomPagination'
import { RouteProps } from '../@types'
import './Console.scss'

interface Data {
  id: number
  type: 'info' | 'warn',
  text: string,
  createOn: number,
  acceptOn: number,
}

export default function Console({location, history, match}: RouteProps<{ name: string }>) {

  const url = `/gateway/messages/${match.params.name}${location.search}`
  const [{error, data, page}, handler] = useData<Data[]>(url)

  data && data.forEach((d, i) => {
    d.id = i
  })

  const cols: Column<Data>[] = [
    {
      key: 'time',
      title: '时间',
      format: formatDate
    },
    {
      key: 'text',
      title: '消息内容',
      format: t => t.text
    },
  ]

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      history.push(`/console?page=${page}`)
    } else {
      history.push(`/console/${match.params.name}?page=${page}&pageSize=${pageSize}`)
    }
  }

  return (
    <div className="Console">
      {error && (
        <Alert message={error} type="error"/>
      )}
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

function formatDate(t: Data) {
  const date = new Date(t.createOn)
  const months = formatNumber(date.getMonth(), '00')
  const dates = formatNumber(date.getDate(), '00')
  const hours = formatNumber(date.getHours(), '00')
  const minutes = formatNumber(date.getMinutes(), '00')
  const seconds = formatNumber(date.getSeconds(), '00')
  return `${months}/${dates} ${hours}:${minutes}:${seconds}`
}
