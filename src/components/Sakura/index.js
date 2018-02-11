import React from 'react'
import {connect} from 'react-redux'
import {Alert, Collapse, Menu, Spin} from 'antd'
import {Disc, DiscColumn, discColumns} from '../../common/disc'
import {isMobile} from '../../utils/window'
import {requestSakura} from '../../reducers/sakuraReducer'
import {compareFactory} from '../../utils/factory'
import Table from '../../libraries/Table'

const rankCompare = compareFactory({
  compare: (a: Disc, b: Disc) => a.thisRank - b.thisRank,
  isEmpty: (disc: Disc) => disc.thisRank === 0,
})

const {rank, totalPt, surplusDays, title} = discColumns

const columnsOfPc = [
  rank, totalPt, surplusDays, title
]

const columnsOfMo = [
  rank, title
]

const requestOfPc: DiscColumn[] = [
  'id', 'asin', 'title', 'thisRank', 'prevRank', 'totalPt', 'surplusDays'
]

const requestOfMo: DiscColumn[] = [
  'id', 'asin', 'title', 'thisRank', 'prevRank'
]

const columns = isMobile() ? columnsOfMo : columnsOfPc
const request = isMobile() ? requestOfMo : requestOfPc
const style = isMobile() ? {marginLeft: -9, marginRight: -9} : {}

interface SakuraData {
  id: number;
  key: string;
  title: string;
  enabled: boolean;
  sakuraUpdateDate: string;
  discs: Disc[];
}

function Sakura({sakuras, pending, message, doRequestSakura}) {
  if (!sakuras && !pending && !message) {
    doRequestSakura(request)
  }

  if (sakuras) {
    sakuras.forEach((s: SakuraData) => s.discs.sort(rankCompare))
  }

  return (
    <div id="sakura">
      {pending && <Spin size="large"/>}
      {message && <Alert message={message} type="error"/>}
      {sakuras && sakuras.length > 0 && (
        <Collapse accordion defaultActiveKey='9999-99'>
          {sakuras.map((s: SakuraData) =>
            <Collapse.Panel header={`点击展开或收起：${s.title}`} key={s.key}>
              <div style={style}>
                <Table title={s.title} rows={s.discs} columns={columns}/>
              </div>
            </Collapse.Panel>
          )}
        </Collapse>
      )}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    sakuras: state.sakura.sakuras,
    pending: state.sakura.pending,
    message: state.sakura.message,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doRequestSakura(request) {
      dispatch(requestSakura(request))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)

export const menu = (
  <Menu>
    <Menu.Item>
      <a style={{cursor: 'pointer'}}>更新Sakura数据</a>
    </Menu.Item>
  </Menu>
)
