import React, { useEffect } from 'react'
import { Alert, PageHeader } from 'antd'

interface Props<T> {
  header: string
  title?: string
  error?: string
}

export function CustomHeader<T>({header, title, error}: Props<T>) {
  useEffect(() => {
    document.title = `${title || header} - mingzuozhibi.com`
  }, [header, title])
  return (
    <>
      <PageHeader title={header} onBack={() => window.history.back()}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
    </>
  )
}
