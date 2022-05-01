import { Page } from '##/@domain'
import { Pagination } from 'antd'
import { useCallback } from 'react'

interface Props {
  page: Page
  onChange: (page: number, size?: number) => void
}

export function CustomPagination({ page, onChange }: Props) {
  const onChangePage = useCallback(
    (page: number, size?: number) => onChange(page, size),
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
    />
  )
}
