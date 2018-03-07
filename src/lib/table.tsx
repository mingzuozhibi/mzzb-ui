import * as React from 'react'
import './table.css'
import { BaseModel } from '../utils/manager'

interface Column<M> {
  key: string
  title: string
  format: (m: M, i: number) => React.ReactNode
}

interface TableProps<M> {
  title?: string
  subtitle?: React.ReactNode
  rows: M[]
  columns: Column<M>[]
}

const Table = <M extends BaseModel>({title, subtitle, rows, columns}: TableProps<M>) => {
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
            <th key={c.key} className={c.key}>{c.title}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {rows.map((m, i) => (
          <tr key={m.id}>
            {columns.map((c) => (
              <td key={c.key} className={c.key}>{c.format(m, i)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export { Table, Column }
