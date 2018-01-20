import React from 'react'
import './bootstrap.min.css'

function Table({title, rows, columns}) {
  return (
    <table className={'table table-striped table-bordered'}>
      <caption>{title}</caption>
      <thead>
      <tr>
        {columns.map(c => (
          <th key={c.className} className={c.className} style={c.style}>{c.title}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {rows.map(data =>
        <tr key={data['id']}>
          {columns.map(c =>
            <td key={c.className} className={c.className}>{c.format(data)}</td>
          )}
        </tr>
      )}
      </tbody>
    </table>
  )
}

export default Table
