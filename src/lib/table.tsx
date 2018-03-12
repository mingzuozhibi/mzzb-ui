import * as React from 'react'
import * as classNames from 'classnames'
import { BaseModel } from '../utils/manager'
import produce from 'immer'
import './table.css'

interface Column<T> {
  key: string
  title: string
  format: (t: T, i: number) => React.ReactNode
  compare?: (a: T, b: T) => number
}

interface TableProps<T> {
  name?: string | number
  title?: string
  subtitle?: React.ReactNode
  rows: T[]
  columns: Column<T>[]
}

interface TableState {
  sortKey?: string
  sortAsc?: boolean
}

class Table<T extends BaseModel> extends React.Component<TableProps<T>, TableState> {

  state: TableState = JSON.parse(localStorage.getItem(`table-state-${this.props.name}`) || '{}')

  sortColumn = (column: Column<T>) => {
    const next = produce(this.state, draftState => {
      if (this.state.sortKey === column.key) {
        draftState.sortAsc = this.state.sortAsc !== true
      } else {
        draftState.sortAsc = true
        draftState.sortKey = column.key
      }
    })
    localStorage.setItem(`table-state-${this.props.name}`, JSON.stringify(next))
    this.setState(next)
  }

  render() {
    const {title, subtitle, rows, columns} = this.props

    const finalRows = produce(rows, draftState => {
      if (this.state.sortKey) {
        const findColumn = this.props.columns.find(c => c.key === this.state.sortKey)
        if (findColumn) {
          draftState.sort(findColumn.compare)
        }
        if (this.state.sortAsc === false) {
          draftState.reverse()
        }
      }
    })

    return (
      <div className="table-root">
        {title && (
          <div className="table-title">
            {title} {subtitle && <span>{subtitle}</span>}
          </div>
        )}
        <table className="table table-striped table-bordered table-hover">
          <thead>
          <tr>
            {columns.map(c => {
              const className = classNames(c.key, {
                sortable: c.compare !== undefined,
                asc: this.state.sortKey === c.key && this.state.sortAsc === true,
                desc: this.state.sortKey === c.key && this.state.sortAsc === false,
              })
              const onClick = c.compare ? () => this.sortColumn(c) : undefined
              return (
                <th key={c.key} className={className} onClick={onClick}>{c.title}</th>
              )
            })}
          </tr>
          </thead>
          <tbody>
          {finalRows.map((t, i) => (
            <tr key={t.id}>
              {columns.map((c) => (
                <td key={c.key} className={c.key}>{c.format(t, i)}</td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export { Table, Column }
