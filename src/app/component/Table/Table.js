import React from 'react'
import './bootstrap.min.css'

function Table({title, rows, columns}) {
  const spanStyle = {fontSize: '24px', marginRight: '10px'}
  return (
    <table className={'table table-striped table-bordered'}>
      <caption><span style={spanStyle}>{title}</span></caption>
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
