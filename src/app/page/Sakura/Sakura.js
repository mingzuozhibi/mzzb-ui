import React from 'react'
import Button from 'material-ui/FloatingActionButton'
import UpdateIcon from 'material-ui/svg-icons/action/update'
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
  data.forEach(list => list['discs'].sort(rankCompare))
  const updateStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '10px'
  }
  return (
    <div id="sakura">
      <Button style={updateStyle} onTouchTap={doFetchSakuraData}>
        <UpdateIcon/>
      </Button>
      {data.map(list =>
        <Table key={list['name']} title={list['title']}
               rows={list['discs']} columns={columns}/>
      )}
    </div>
  )
}

export default Sakura
