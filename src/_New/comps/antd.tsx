import React from 'react'
import { Pagination } from 'antd'
import { Page } from '../hooks/useData'

interface CustomPaginationProps {
  page: Page
  onChange: (page: number, pageSize?: number) => void
}

export function CustomPagination({page, onChange}: CustomPaginationProps) {
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
