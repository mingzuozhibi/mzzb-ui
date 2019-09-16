import React from 'react'
import { withRouter } from 'react-router-dom'
import { Alert } from 'antd'
import { useData } from '../../hooks/useData'
import { useTitle } from '../../hooks/hooks'
import { formatNumber } from '../../funcs/format'
import { Column, Table } from '../../comps/@table/Table'
import { CustomPagination } from '../../comps/CustomPagination'
import { RouteProps } from '../@types'
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
  tableTitle: string
}

export default withRouter(Messages)

function Messages(props: Props & RouteProps<{ name: string }>) {

  const {moduleName, tableTitle, location, history, match} = props
  const url = `/gateway/messages/${moduleName}${location.search}`
  const [{error, data, page}, handler] = useData<Data[]>(url)

  data && data.forEach((d, i) => {
    d.id = i
  })

  const cols = getCols()

  useTitle(tableTitle)

  function onPaginationChange(page: number, pageSize?: number) {
    if (pageSize === 20) {
      history.push(`/console?page=${page}`)
    } else {
      history.push(`/console/${match.params.name}?page=${page}&pageSize=${pageSize}`)
    }
  }

  return (
    <div className="Messages">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <Table
          title={tableTitle}
          cols={cols}
          rows={data}
          handler={handler}
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
      format: formatDate
    },
    {
      key: 'text',
      title: '消息内容',
      format: t => t.text
    },
  ]
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

function trClass(t: Data) {
  return {
    'warning': t.type === 'warning',
    'success': t.type === 'success',
    'danger': t.type === 'danger',
    'info': t.type === 'notify',
  }
}
