import React from 'react'
import {connect} from 'react-redux'
import Table, {Column} from '../../libraries/Table'
import {requestHandler} from '../../utils/handler'
import {compareFactory} from '../../utils/factory'
import sakuraManager from '../../services/sakuraManager'
import {updateSakura} from '../../reducers/sakuraReducer'
import {showSuccess} from '../../utils/window'
import {Affix, Anchor, Card} from 'antd'

const {Link} = Anchor

const rankCompare = compareFactory({
  compare: (a, b) => a['thisRank'] - b['thisRank'],
  isEmpty: disc => disc['thisRank'] === 0,
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
  data.forEach(s => s['discs'].sort(rankCompare))
  return (
    <div id="sakura">
      {data.map(s =>
        <div id={s['key']} key={s['key']}>
          <Table title={s['title']} rows={s['discs']} columns={columns}/>
        </div>
      )}
      <Affix offsetBottom={24}>
        <Card style={{width: 200}}>
          <Anchor>
            {data.map(s => (
              <Link key={s['key']} href={'#' + s['key']} title={s['title']}/>
            ))}
          </Anchor>
        </Card>
      </Affix>
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
