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
  unikey?: string
  message: string
}

export function ClosableMessage({unikey, message}: ClosableMessageProps) {
  if (!unikey) unikey = window.location.pathname
  const showMessage = localStorage[`message/${unikey}`] !== message
  const hideMessage = () => localStorage[`message/${unikey}`] = message
  return showMessage ? <Alert message={message} closable onClose={hideMessage}/> : null
}
