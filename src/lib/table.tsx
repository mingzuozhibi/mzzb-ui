import * as React from 'react'
import './table.css'
import { Model } from '../utils/manager'

interface Column<T> {
  key: string
  title: string
  format: (t: T) => React.ReactNode
}

interface TableProps<T> {
  title?: string
  subtitle?: React.ReactNode
  rows: T[]
  columns: Column<T>[]
}

const Table = <T extends Model>({title, subtitle, rows, columns}: TableProps<T>) => {
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
        {rows.map(t => (
          <tr key={t.id}>
            {columns.map(c => (
              <td key={c.key} className={c.key}>{c.format(t)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export { Table, Column }
