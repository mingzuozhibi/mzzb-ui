import React, { useState } from 'react'
import { Alert, Button } from 'antd'
import { useData } from '../../hooks/useData'
import { CustomDate } from '../../comps/CustomDate'
import { Column, Table } from '../../comps/@table/Table'
import { CustomPagination } from '../../comps/CustomPagination'
import './Messages.scss'

interface Data {
  id: number
  type: 'info' | 'success' | 'notify' | 'warning' | 'danger',
  text: string,
  createOn: number,
  acceptOn: number,
}

interface Props {
  moduleName: string
}

export default function Messages({moduleName}: Props) {

  const [{pageNumber, pageSize}, setPage] = useState({pageNumber: 1, pageSize: 40})
  const url = `/gateway/messages/${moduleName}?page=${pageNumber}&pageSize=${pageSize}`
  const [{error, data, page}, handler] = useData<Data[]>(url)

  data && data.forEach((e, i) => e.id = i)

  const cols = getCols()

  function onPaginationChange(page: number, pageSize?: number) {
    setPage({pageNumber: page, pageSize: pageSize || 40})
    window.scroll(0, 0)
  }

  return (
    <div className="Messages">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <div style={{marginBottom: 10}}>
          <Button
            children={'刷新'}
            onClick={handler.refresh}
            loading={handler.loading}
            style={{marginRight: 10}}
          />
        </div>
      )}
      {page && (
        <div style={{marginBottom: 10}}>
          <CustomPagination page={page} onChange={onPaginationChange}/>
        </div>
      )}
      {data && (
        <Table
          cols={cols}
          rows={data}
          trClass={trClass}
        />
      )}
      {page && (
        <CustomPagination page={page} onChange={onPaginationChange}/>
      )}
    </div>
  )
}

function getCols(): Column<Data>[] {
  return [
    {
      key: 'time',
      title: '时间',
      format: t => <CustomDate time={t.createOn}/>
    },
    {
      key: 'text',
      title: '消息内容',
      format: t => t.text
    },
  ]
}

function trClass(t: Data) {
  return {
    'warning': t.type === 'warning',
    'success': t.type === 'success',
    'danger': t.type === 'danger',
    'info': t.type === 'notify',
  }
}
