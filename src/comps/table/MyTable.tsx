import { useLocal } from '#H/useLocal'
import classNames from 'classnames'
import React from 'react'
import './MyTable.scss'

interface BaseRow {
  id: number
}

export interface MyColumn<T> {
  key: string
  title: React.ReactNode
  format: (row: T, idx: number) => React.ReactNode
  tdClass?: (row: T) => string | object | null
  compare?: (a: T, b: T) => number
}

interface Props<T> {
  tag: string
  rows: T[]
  cols: MyColumn<T>[]
  title?: React.ReactNode
  trClass?: (row: T) => string | object
  defaultSort?: (a: T, b: T) => number
  extraCaption?: React.ReactNode
}

interface State {
  sortKey?: string
  sortAsc?: boolean
}

export function MyTable<T extends BaseRow>(props: Props<T>) {
  const { tag, cols, title, trClass, defaultSort, extraCaption } = props

  const [{ sortKey, sortAsc }, setState] = useLocal<State>(`local-table-state-${tag}`, {})

  const rows = sortRows()

  return (
    <div className="MyTable">
      {(title || extraCaption) && renderCaption()}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                children={col.title}
                className={thClass(col)}
                onClick={col.compare && (() => thClick(col))}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} id={`row-${row.id}`} className={trClass && classNames(trClass(row))}>
              {cols.map((col) => (
                <td key={col.key} className={tdClass(col, row)}>
                  {col.format(row, idx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    const array = [...props.rows]
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

  function thClick(col: MyColumn<T>) {
    if (sortKey === col.key) {
      setState({ sortKey, sortAsc: sortAsc !== true })
    } else {
      setState({ sortKey: col.key, sortAsc: true })
    }
  }

  function thClass(col: MyColumn<T>) {
    return classNames(col.key, {
      sortable: col.compare !== undefined,
      asc: sortKey === col.key && sortAsc === true,
      desc: sortKey === col.key && sortAsc === false,
    })
  }

  function tdClass(col: MyColumn<T>, row: T) {
    return classNames(col.key, col.tdClass && col.tdClass(row))
  }
}
