import React from 'react'
import classNames from 'classnames'
import { BaseModel } from '../utils/manager'
import produce from 'immer'
import './table.scss'

export interface Column<T> {
  key: string
  title: string
  format: (t: T, i: number) => React.ReactNode
  tdClass?: (t: T) => string
  compare?: (a: T, b: T) => number
}

interface TableProps<T> {
  rows: T[]
  columns: Column<T>[]
  name?: string | number
  title?: string
  subtitle?: React.ReactNode
  trClass?: (t: T) => string
}

interface TableState {
  sortKey?: string
  sortAsc?: boolean
}

export class Table<T extends BaseModel> extends React.Component<TableProps<T>, TableState> {

  state: TableState = JSON.parse(sessionStorage.getItem(`table-state-${this.props.name}`) || '{}')

  sortColumn = (column: Column<T>) => {
    const next = produce(this.state, draftState => {
      if (this.state.sortKey === column.key) {
        draftState.sortAsc = this.state.sortAsc !== true
      } else {
        draftState.sortAsc = true
        draftState.sortKey = column.key
      }
    })
    sessionStorage.setItem(`table-state-${this.props.name}`, JSON.stringify(next))
    this.setState(next)
  }

  render() {
    const {title, subtitle, rows, columns, trClass} = this.props

    const finalRows = produce(rows, (draft: T[]) => {
      if (this.state.sortKey) {
        const findColumn = this.props.columns.find(c => c.key === this.state.sortKey)
        if (findColumn) {
          draft.sort(findColumn.compare)
        }
        if (this.state.sortAsc === false) {
          draft.reverse()
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
            {columns.map(c => (
              <th key={c.key} onClick={this.thClick(c)} className={this.thClass(c)}>
                {c.title}
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {finalRows.map((t, i) => (
            <tr key={t.id} className={trClass && trClass(t)}>
              {columns.map((c) => (
                <td key={c.key} className={this.tdClass(c, t)}>
                  {c.format(t, i)}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }

  private thClick(c: Column<T>) {
    return c.compare && (() => this.sortColumn(c))
  }

  private thClass(c: Column<T>) {
    return classNames(c.key, {
      sortable: c.compare !== undefined,
      asc: this.state.sortKey === c.key && this.state.sortAsc === true,
      desc: this.state.sortKey === c.key && this.state.sortAsc === false,
    })
  }

  private tdClass(c: Column<T>, t: T) {
    return classNames(c.key, c.tdClass && c.tdClass(t))
  }

}
