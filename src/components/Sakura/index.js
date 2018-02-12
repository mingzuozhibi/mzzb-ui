import React from 'react'
import {Alert, Collapse} from 'antd'
import {Table, Timer} from '../../libraries'
import {Disc, DiscColumn, discColumns} from '../../common/disc'
import {listSakura} from '../../reducers/sakuraReducer'
import {compareFactory} from '../../utils/factory'
import {isMobile} from '../../utils/window'
import {regReload} from '../../reducers/layoutReducer'
import connect from '../../utils/connect'

const discColumnsOfPc = [
  discColumns.rank,
  discColumns.totalPt,
  discColumns.surplusDays,
  discColumns.title,
]

const discColumnsOfMo = [
  discColumns.rank,
  discColumns.title,
]

const discRequestOfPc: DiscColumn[] = [
  'id', 'title', 'thisRank', 'prevRank', 'totalPt', 'surplusDays'
]

const discRequestOfMo: DiscColumn[] = [
  'id', 'title', 'thisRank', 'prevRank'
]

function getColumns() {
  return isMobile() ? discColumnsOfMo : discColumnsOfPc
}

function getRequest() {
  return isMobile() ? discRequestOfMo : discRequestOfPc
}

function getStyles() {
  return isMobile() ? {marginLeft: -9, marginRight: -9} : {}
}

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

function Sakura({sakuras, pending, message, dispatch}) {
  if (!sakuras && !pending && !message) {
    dispatch(listSakura(getRequest()))
  }

  if (sakuras) {
    const rankCompare = compareFactory({
      compare: (a: Disc, b: Disc) => a.thisRank - b.thisRank,
      isEmpty: (disc: Disc) => disc.thisRank === 0,
    })

    sakuras.forEach((s: SakuraData) => s.discs.sort(rankCompare))
  }

  return (
    <div id="sakura">
      {message && <Alert message={message} type="error"/>}
      {sakuras && sakuras.length > 0 && (
        <Collapse defaultActiveKey='9999-99'>
          {sakuras.map((s: SakuraData) =>
            <Collapse.Panel header={`点击展开或收起：${s.title}`} key={s.key}>
              <div style={getStyles()}>
                <Table title={titleAndTimer(s)} rows={s.discs} columns={getColumns()}/>
              </div>
            </Collapse.Panel>
          )}
        </Collapse>
      )}
    </div>
  )
}

function mapState(state) {
  return {
    sakuras: state.sakura.sakuras,
    pending: state.sakura.pending,
    message: state.sakura.message,
  }
}

export default connect(mapState, (dispatch) => {
  dispatch(regReload(listSakura(getRequest()), (state) => state.sakura.pending))
}, Sakura)
