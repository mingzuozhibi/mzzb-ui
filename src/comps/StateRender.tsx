import React, { HTMLProps, useMemo, useCallback } from "react"
import { useHistory } from "react-router-dom"
import { Button, PageHeader, Alert } from "antd"
import { useTitle } from "../hooks/hooks"
import { Handler, State } from "../@domain"
import { CustomPagination } from "./CustomPagination"

export interface StateRenderProps<T> extends HTMLProps<HTMLDivElement> {
  state: State<T>
  handler?: Handler
  title?: string
  extra?: React.ReactNode[]
  render: (data: T) => React.ReactNode
  children?: React.ReactNode
  showPage?: 'header' | 'footer' | 'both' | 'none'
  onChangePage?: (page: number, size?: number) => void
}

export function StateRender<T>(props: StateRenderProps<T>) {
  const { state, handler, title, extra = [], render, children, showPage = 'footer', onChangePage, ...otherProps } = props
  const { error, data, page } = state

  useTitle(title)
  const history = useHistory()
  const extraMemo = useMemo(() => {
    const refreshButton = handler && (
      <Button key="refresh" onClick={handler.refresh} loading={handler.loading}>刷新</Button>
    )
    return [refreshButton, ...extra]
  }, [handler, extra])

  const handleChangePage = useCallback((page: number, size: number = 20) => {
    history.push(history.location.pathname + `?page=${page}&size=${size}`)
  }, [history])

  const headerPage = showPage === 'header' || showPage === 'both'
  const footerPage = showPage === 'footer' || showPage === 'both'

  return (
    <div {...otherProps}>
      {title && (
        <PageHeader title={title} onBack={() => history.goBack()} extra={extraMemo} />
      )}
      {error && (
        <Alert message={error} type="error" />
      )}
      <div style={{ marginBottom: 10 }}>
        {children}
      </div>
      {page && headerPage && (
        <CustomPagination page={page} onChange={onChangePage || handleChangePage} />
      )}
      {data && render(data)}
      {page && footerPage && (
        <CustomPagination page={page} onChange={onChangePage || handleChangePage} />
      )}
    </div>
  )
}
