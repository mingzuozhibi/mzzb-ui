import React from 'react'

function Table({title, rows, columns}) {
  const titleStyle = {fontSize: '24px', marginRight: '10px', marginBottom: '5px'}
  return (
    <div>
      <div style={titleStyle}>{title}</div>
      <table className={'table table-striped table-bordered'}>
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
    </div>
  )
}

export default Table
