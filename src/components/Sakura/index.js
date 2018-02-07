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

const defaultColumns = ['id', 'asin', 'title', 'thisRank', 'prevRank', 'totalPt', 'surplusDays']

const columns = [
  new Column({
    className: 'rank',
    title: '日亚排名',
    style: {width: '120px'},
    format: disc => `${disc['thisRank']}位/${disc['prevRank']}位`,
  }),
  new Column({
    className: 'totalPt',
    hide: true,
    title: '累积PT',
    style: {width: '75px'},
    format: disc => `${disc['totalPt']} pt`,
  }),
  new Column({
    className: 'surplusDays',
    hide: true,
    title: '发售日',
    style: {width: '90px'},
    format: disc => `还有${disc['surplusDays']}天`,
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
        <div key={list['key']}>
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

function fetchSakuraData(discColumns) {
  return requestHandler({
    fetchCall: () => sakuraManager.lists(discColumns),
    fetchDone: (json, dispatch) => {
      showSuccess('更新Sakura数据成功')
      dispatch(updateSakura(json.data))
    }
  })
}

function mapDispatchToProps(dispatch) {
  dispatch(fetchSakuraData(defaultColumns))
  return {
    doFetchData(discColumns) {
      dispatch(fetchSakuraData(discColumns))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
