import React from 'react'
import Table, {Column} from '../../component/Table'

function compareFactory({compare, empty = () => false}) {
  return (a, b) => {
    const is_empty_a = empty(a)
    const is_empty_b = empty(b)
    if (is_empty_a && is_empty_b) {
      return 0
    }
    if (is_empty_a || is_empty_b) {
      return is_empty_a ? 1 : -1
    }
    return compare(a, b)
  }
}

const rankCompare = compareFactory({
  compare: (a, b) => a['this_rank'] - b['this_rank'],
  empty: n => n['this_rank'] === 0,
})

const columns = [
  new Column({
    className: 'rank',
    title: '日亚排名',
    style: {width: '120px'},
    format: disc => {
      const this_rank = disc['this_rank']
      const prev_rank = disc['prev_rank']
      const text = `${this_rank}位/${prev_rank}位`
      return text.length <= 11 ? text : text.substr(0, 11) + '...'
    },
  }),
  new Column({
    className: 'sumpt',
    title: '累积PT',
    style: {width: '75px'},
    format: disc => `${disc['total_point']} pt`,
  }),
  new Column({
    className: 'sday',
    title: '发售日',
    style: {width: '90px'},
    format: disc => {
      const sday = disc['surplus_days']
      if (sday > 0) {
        return `还有${sday}天`
      } else {
        return '已经发售'
      }
    },
  }),
  new Column({
    className: 'title',
    title: '碟片标题',
    format: disc => disc['title'],
  }),
]

function Sakura({doFetchData, data}) {
  data.forEach(list => list['discs'].sort(rankCompare))
  return (
    <div id="sakura">
      {data.map(list =>
        <div key={list['name']}>
          <Table title={list['title']} rows={list['discs']} columns={columns}/>
        </div>
      )}
    </div>
  )
}

export default Sakura
