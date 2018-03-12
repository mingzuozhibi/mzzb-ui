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
  title?: string
  subtitle?: React.ReactNode
  rows: T[]
  columns: Column<T>[]
}

interface TableState<T> {
  sortColumn?: Column<T>
  sortAsc?: boolean
}

class Table<T extends BaseModel> extends React.Component<TableProps<T>, TableState<T>> {

  state: TableState<T> = {}

  sortColumn = (column: Column<T>) => {
    this.setState(produce(this.state, draftState => {
      if (this.state.sortColumn === column) {
        draftState.sortAsc = this.state.sortAsc !== true
      } else {
        draftState.sortAsc = true
        draftState.sortColumn = column
      }
    }))
  }

  render() {
    const {title, subtitle, rows, columns} = this.props

    const finalRows = produce(rows, draftState => {
      if (this.state.sortColumn) {
        draftState.sort(this.state.sortColumn.compare)
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
                asc: this.state.sortColumn === c && this.state.sortAsc === true,
                desc: this.state.sortColumn === c && this.state.sortAsc === false,
              })
              return (
                <th key={c.key} className={className} onClick={() => this.sortColumn(c)}>{c.title}</th>
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
