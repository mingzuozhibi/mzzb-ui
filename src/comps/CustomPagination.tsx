import { Page } from '##/@domain'
import { Pagination } from 'antd'

interface Props {
  page: Page
  onChange: (page: number, pageSize?: number) => void
}

export function CustomPagination({ page, onChange }: Props) {
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
