import { MzPagination } from '#CC/pagination/MzPagination'
import { useLocal } from '#CH/useLocal'
import { useSearch } from '#CH/useSearch'
import { Empty, Space } from 'antd'
import classNames, { Argument } from 'classnames'
import { ReactNode } from 'react'
import './MzTable.scss'

interface BaseRow {
  id: number
}

export interface MzColumn<T> {
  key: string
  title: ReactNode
  format: (row: T, idx: number) => ReactNode
  tdClass?: (row: T) => Argument
  tdClick?: (row: T) => void
  compare?: (a: T, b: T) => number
}

interface Props<T> {
  tag: string
  cols: MzColumn<T>[]
  rows?: T[]
  title?: ReactNode
  trClass?: (row: T) => Argument
  usePage?: boolean | number
  defaultSort?: (a: T, b: T) => number
  extraCaption?: ReactNode
  showEmptyImage?: boolean
}

interface State {
  sortKey?: string
  sortAsc?: boolean
}

export function MzTable<T extends BaseRow>(props: Props<T>) {
  const { tag, cols, title, usePage, defaultSort, extraCaption } = props

  const [{ sortKey, sortAsc }, setSort] = useLocal<State>(`table-sort-${tag}`, {})

  let lastRows = sortRows()

  const [{ page, size }, setPage] = useSearch(
    {
      page: 1,
      size: typeof usePage === 'number' ? usePage : 50,
    },
    { numberNames: ['page', 'size'] }
  )

  const onChangePage = (page: number, size: number = 50) => {
    setPage({ page, size })
  }

  const showPage = typeof usePage === 'number' || usePage === true
  const totalRow = lastRows.length

  if (showPage) {
    lastRows = lastRows.slice((page - 1) * size, page * size)
  }

  return (
    <div className="MzTable">
      {(title || extraCaption) && renderCaption()}
      <Space direction="vertical" style={{ width: '100%' }}>
        {showPage && (
          <MzPagination
            page={{ currentPage: page, pageSize: size, totalElements: totalRow }}
            onChange={onChangePage}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        )}
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              {cols.map((col) => (
                <th
                  key={col.key}
                  children={col.title}
                  className={thClass(col)}
                  onClick={col.compare ? () => thClick(col) : () => setSort({})}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {lastRows.map((row, idx) => (
              <tr key={row.id} id={`row-${row.id}`} className={trClass(row)}>
                {cols.map((col) => (
                  <td
                    key={col.key}
                    className={tdClass(col, row)}
                    onClick={() => col.tdClick?.(row)}
                    style={{ cursor: col.tdClick ? 'pointer' : undefined }}
                  >
                    {col.format(row, idx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {lastRows.length === 0 && props.showEmptyImage !== false && (
          <div className="empty-warpper">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
        {showPage && (
          <MzPagination
            page={{ currentPage: page, pageSize: size, totalElements: totalRow }}
            onChange={onChangePage}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        )}
      </Space>
    </div>
  )

  function renderCaption() {
    return (
      <div className="table-caption">
        {title && <span className="caption-title">{title}</span>}
        {extraCaption && <span className="caption-extra">{extraCaption}</span>}
      </div>
    )
  }

  function sortRows() {
    const array = [...(props.rows ?? [])]
    if (sortKey) {
      const findCol = cols.find((col) => col.key === sortKey)
      if (findCol && findCol.compare) {
        const compare = findCol.compare
        array.sort((a, b) => {
          return sortAsc ? compare(a, b) : -compare(a, b)
        })
      }
    } else if (defaultSort) {
      array.sort(defaultSort)
    }
    return array
  }

  function thClick(col: MzColumn<T>) {
    if (sortKey !== col.key) {
      setSort({ sortKey: col.key, sortAsc: true })
    } else if (sortAsc === true) {
      setSort({ sortKey, sortAsc: false })
    } else {
      setSort({})
    }
  }

  function thClass(col: MzColumn<T>) {
    return classNames(col.key, {
      sortable: col.compare !== undefined,
      asc: sortKey === col.key && sortAsc === true,
      desc: sortKey === col.key && sortAsc === false,
    })
  }

  function tdClass(col: MzColumn<T>, row: T) {
    return classNames(col.key, col.tdClass && col.tdClass(row))
  }

  function trClass(row: T) {
    if (props.trClass) return classNames(props.trClass(row))
  }
}
