import React from 'react'
import { Alert, Pagination } from 'antd'
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

interface ClosableMessageProps {
  message: string
}

export function ClosableMessage(props: ClosableMessageProps) {
  const message = props.message
  const showMessage = localStorage[`message/${window.location.pathname}`] !== message
  const hideMessage = () => localStorage[`message/${window.location.pathname}`] = message
  return showMessage ? <Alert message={message} closable onClose={hideMessage}/> : null
}
