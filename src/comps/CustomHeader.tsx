import React, { useEffect } from 'react'
import ArrowLeft from '@ant-design/icons/ArrowLeft'
import { Alert, Button, Divider, PageHeader } from 'antd'
import { Handler } from '../reducers/@domain'

interface Props<T> {
  header: string
  title?: string
  error?: string
  handler?: Handler
  replace?: React.ReactNode
}

export function CustomHeader<T>({header, title, error, handler, replace}: Props<T>) {
  useEffect(() => {
    document.title = `${title || header} - mingzuozhibi.com`
  }, [header, title])
  return (
    <>
      {replace ? renderCustomHeader(replace) : renderPageHeader(header, handler)}
      {error && (
        <Alert message={error} type="error"/>
      )}
    </>
  )
}

function renderPageHeader(header: string, handler?: Handler) {
  return (
    <PageHeader
      title={header}
      onBack={() => window.history.back()}
      extra={handler && (
        <Button loading={handler.loading} onClick={handler.refresh}>刷新</Button>
      )}
    />
  )
}

function renderCustomHeader(replace: React.ReactNode) {
  return (
    <div className="custom-header">
      <ArrowLeft onClick={() => window.history.back()}/>
      <Divider type="vertical"/>
      {replace}
    </div>
  )
}
