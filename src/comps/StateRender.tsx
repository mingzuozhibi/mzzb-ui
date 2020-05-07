import React, { HTMLProps, useMemo } from "react"
import { useHistory } from "react-router-dom"
import { Button, PageHeader, Alert } from "antd"
import { State } from "../hooks/useData"
import { useTitle } from "../hooks/hooks"
import { Handler } from "../reducers/@domain"
import { CustomPagination } from "./CustomPagination"

export interface StateRenderProps<T> extends HTMLProps<HTMLDivElement> {
  state: State<T>
  handler?: Handler
  title?: string
  extra?: React.ReactNode[]
  render: (data: T) => React.ReactNode
  onChangePage?: (page: number, size?: number) => void
}

export function StateRender<T>(props: StateRenderProps<T>) {
  const { state, handler, title, extra = [], render, onChangePage, ...otherProps } = props
  const { error, data, page } = state

  useTitle(title)
  const history = useHistory()
  const extraMemo = useMemo(() => {
    const refreshButton = handler && (
      <Button key="refresh" onClick={handler.refresh} loading={handler.loading}>刷新</Button>
    )
    return [refreshButton, ...extra]
  }, [handler, extra])

  return (
    <div {...otherProps}>
      {title && (
        <PageHeader title={title} onBack={() => history.goBack()} extra={extraMemo} />
      )}
      {error && (
        <Alert message={error} type="error" />
      )}
      {data && render(data)}
      {page && onChangePage && (
        <CustomPagination page={page} onChange={onChangePage} />
      )}
    </div>
  )
}
