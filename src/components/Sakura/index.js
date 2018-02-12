import React from 'react'
import {connect} from 'react-redux'
import {Alert, Collapse} from 'antd'
import {Disc, DiscColumn, discColumns} from '../../common/disc'
import {requestListSakura} from '../../reducers/sakuraReducer'
import {compareFactory} from '../../utils/factory'
import {isMobile} from '../../utils/window'
import Table from '../../libraries/Table'
import Timer from '../../libraries/Timer'
import Reload from '../../libraries/Reload'

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
  sakuraUpdateDate: number;
  discs: Disc[];
}

const timerRender = ({hour, minute}) => {
  return (
    <span className="header-icon">
      {`${hour}时${minute}分前`}
    </span>
  )
}

function titleAndTimer(sakura) {
  return (
    <span>
      <span>{sakura.title}</span>
      <Timer render={timerRender} timeout={20000} time={sakura.sakuraUpdateDate}/>
    </span>
  )
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
      {message && <Alert message={message} type="error"/>}
      {sakuras && sakuras.length > 0 && (
        <Collapse defaultActiveKey='9999-99'>
          {sakuras.map((s: SakuraData) =>
            <Collapse.Panel header={`点击展开或收起：${s.title}`} key={s.key}>
              <div style={style}>
                <Table title={titleAndTimer(s)} rows={s.discs} columns={columns}/>
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
      dispatch(requestListSakura(request))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)

export const sakuraIcons = [
  <Reload
    key="reload"
    action={requestListSakura(request)}
    isPending={(state) => state.sakura.pending}
  />,
]
