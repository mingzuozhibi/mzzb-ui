import { ILoad } from '#T/result'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Button, Divider, PageHeader } from 'antd'
import React, { useEffect } from 'react'

interface Props {
  header: string
  title?: string
  error?: string
  handler?: ILoad
  replace?: React.ReactNode
}

export function MzHeader({ header, title, error, handler, replace }: Props) {
  useEffect(() => {
    document.title = `${title || header} - mingzuozhibi.com`
  }, [header, title])
  return (
    <>
      {replace ? renderCustomHeader(replace) : renderPageHeader(header, handler)}
      {error && <Alert message={error} type="error" />}
    </>
  )
}

function renderPageHeader(header: string, handler?: ILoad) {
  return (
    <PageHeader
      title={header}
      onBack={() => window.history.back()}
      extra={
        handler && (
          <Button loading={handler.loading} onClick={handler.refresh}>
            刷新
          </Button>
        )
      }
    />
  )
}

function renderCustomHeader(replace: React.ReactNode) {
  return (
    <div className="custom-header">
      <ArrowLeftOutlined onClick={() => window.history.back()} />
      <Divider type="vertical" />
      {replace}
    </div>
  )
}
