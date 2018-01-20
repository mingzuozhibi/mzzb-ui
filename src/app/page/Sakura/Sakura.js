import React from 'react'
import Button from 'material-ui/FloatingActionButton'
import UpdateIcon from 'material-ui/svg-icons/action/update'
import './bootstrap.min.css'

class Column {
  constructor({className, compare, format, style = {}, title}) {
    this.className = className
    this.compare = compare
    this.format = format
    this.style = style
    this.title = title
  }
}

const columns = [
  new Column({
    className: 'rank',
    title: '日亚排名',
    style: {width: '165px'},
    format: disc => `${disc['this_rank']}位/${disc['prev_rank']}位`,
  }),
  new Column({
    className: 'sumpt',
    title: '累积PT',
    style: {width: '105px'},
    format: disc => `${disc['total_point']} pt`,
  }),
  new Column({
    className: 'sday',
    title: '剩余天数',
    style: {width: '95px'},
    format: disc => `${disc['surplus_days']}天`,
  }),
  new Column({
    className: 'title',
    title: '碟片标题',
    format: disc => disc['title'],
  }),
]

function Sakura({doFetchSakuraData, data}) {
  data.map(list => list['discs']).forEach(discs => {
    discs.sort((a, b) => a['this_rank'] - b['this_rank'])
  })
  const updateStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '10px'
  }
  const tableClass = 'table table-striped table-bordered'
  return (
    <div id="sakura">
      <Button style={updateStyle} onTouchTap={doFetchSakuraData}>
        <UpdateIcon/>
      </Button>
      {data.map(list => (
        <table className={tableClass} key={list['name']}>
          <caption>{list['title']}</caption>
          <thead>
          <tr>
            {columns.map(c => (
              <th className={c.className} style={c.style}>{c.title}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {list['discs'].map(disc => (
            <tr key={disc['asin']}>
              {columns.map(c =>
                (<td className={c.className}>{c.format(disc)}</td>)
              )}
            </tr>
          ))}
          </tbody>
        </table>
      ))}
    </div>
  )
}

export default Sakura
