import React from 'react'
import { Pagination } from 'antd'
import { Page } from '../reducers/@domain'

interface Props {
  page: Page
  onChange: (page: number, pageSize?: number) => void
}

export function CustomPagination({page, onChange}: Props) {
  return (
    <Pagination
      showSizeChanger
      showQuickJumper
      pageSize={page.pageSize}
      current={page.currentPage}
      total={page.totalElements}
      onChange={onChange}
      onShowSizeChange={onChange}
    />
  )
}

