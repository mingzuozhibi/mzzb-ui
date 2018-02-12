import React from 'react'

export function Table({title, rows, columns}) {
  const titleStyle = {fontSize: '24px', padding: '12px'}
  return (
    <div>
      <div style={titleStyle}>{title}</div>
      <table className={'table table-striped table-bordered'}>
        <thead>
        <tr>
          {columns.map(c => (
            <th key={c.className} className={c.className} style={c.style}>{c.text}</th>
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
    </div>
  )
}

Table.Column = class Column {
  constructor({className, format, style = {}, title}) {
    this.className = className
    this.format = format
    this.style = style
    this.text = title
  }
}
