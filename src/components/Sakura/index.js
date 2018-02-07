import React from 'react'
import {connect} from 'react-redux'
import {Spin} from 'antd'
import Table, {Column} from '../../libraries/Table'
import {requestHandler} from '../../utils/handler'
import {compareFactory} from '../../utils/factory'
import sakuraManager from '../../services/sakuraManager'
import {updateSakura} from '../../reducers/sakuraReducer'
import {showSuccess} from '../../utils/window'

const rankCompare = compareFactory({
  compare: (a, b) => a['this_rank'] - b['this_rank'],
  isEmpty: disc => disc['this_rank'] === 0,
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
      {data.length > 0 ? data.map(list =>
        <div key={list['name']}>
          <Table title={list['title']} rows={list['discs']} columns={columns}/>
        </div>
      ) : <Spin size="large">正在载入数据</Spin>}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    data: state.sakura.data
  }
}

function fetchSakuraData() {
  return requestHandler({
    fetchCall: () => sakuraManager.lists(),
    fetchDone: (json, dispatch) => {
      showSuccess('更新Sakura数据成功')
      dispatch(updateSakura(json.data))
    }
  })
}

function mapDispatchToProps(dispatch) {
  dispatch(fetchSakuraData())
  return {
    doFetchData() {
      dispatch(fetchSakuraData())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
