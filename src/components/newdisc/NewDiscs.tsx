import React, { useEffect, useState } from 'react'
import { Alert, Pagination } from 'antd'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Column, Table } from '../../lib/table'
import { BaseModel, Manager } from '../../utils/manager'
import { useDocumentTitle } from '../../hooks'

interface NewDisc extends BaseModel {
  asin: string
  title: string
  followed: boolean
  createTime: number
}

interface PageData {
  pageSize: number
  currentPage: number
  totalElements: number
}

const manager = new Manager<NewDisc>('/api/newdiscs')

function getPage({page, maxPage, maxSize}: any) {
  return {currentPage: page + 1, pageSize: maxSize, totalElements: (maxPage + 1) * maxSize}
}

export default function NewDiscs(props: RouteComponentProps<{}>) {

  const [data, setData] = useState<NewDisc[]>()
  const [page, setPage] = useState<PageData>()
  const [error, setError] = useState<string>()

  useDocumentTitle('上架追踪')

  useEffect(() => {
    manager.findAll(props.location.search).then(result => {
      if (result.success) {
        const data: any = result.data
        setData(data.newdiscs)
        setPage(getPage(data.pageInfo))
      } else {
        setError(result.message)
      }
    })
  }, [props.location.search])

  return (
    <div className="newdisc">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <div className="newdisc-content">
          <Table title="上架追踪" rows={data} columns={getColumns()}/>
          {page && (
            <Pagination
              showQuickJumper
              current={page.currentPage}
              total={page.totalElements}
              pageSize={page.pageSize}
              onChange={page => props.history.push(`/new_discs?page=${page - 1}`)}/>
          )}
        </div>
      )}
    </div>
  )
}

function getColumns(): Column<NewDisc>[] {
  return [
    {
      key: 'id',
      title: '#',
      format: (t) => t.id
    },
    {
      key: 'asin',
      title: 'ASIN',
      format: (t) => t.asin
    },
    {
      key: 'followed',
      title: '%',
      format: (t) => t.followed ? <Link to={`/disc/find/asin/${t.asin}`}>有</Link> : '无'
    },
    {
      key: 'createTime',
      title: '抓取时间',
      format: (t) => formatCreateTime(t)
    },
    {
      key: 'title',
      title: '标题',
      format: (t) => <a href={`http://www.amazon.co.jp/dp/${t.asin}`} target="_blank"
                        rel="noopener noreferrer">{t.title}</a>
    },
  ]
}

function formatCreateTime(t: NewDisc) {
  const date = new Date(t.createTime)
  return `${date.toLocaleDateString()} ${date.getHours()}时${date.getMinutes()}分`
}
