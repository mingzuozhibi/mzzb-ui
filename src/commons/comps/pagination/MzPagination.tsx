import { IPage } from '#DT/result'
import { Pagination } from 'antd'
import { useCallback } from 'react'

interface Props {
  page: IPage
  onChange: (page: number, size?: number) => void
  pageSizeOptions?: number[]
}

export function MzPagination(props: Props) {
  const { page, onChange, pageSizeOptions } = props

  const onChangePage = useCallback(
    (pageNumber: number, pageSize?: number) => {
      if (page.pageSize !== pageSize) {
        onChange(1, pageSize)
      } else {
        onChange(pageNumber, pageSize)
      }
    },
    [onChange]
  )

  return (
    <Pagination
      showSizeChanger
      showQuickJumper
      pageSize={page.pageSize}
      current={page.currentPage}
      total={page.totalElements}
      onChange={onChangePage}
      onShowSizeChange={onChangePage}
      pageSizeOptions={pageSizeOptions ?? [10, 20, 30, 40]}
    />
  )
}
