import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../../@reducer'
import { DiscGroupItems } from './DiscGroupItems'
import { Disc } from '../../@disc/disc'

export default connect(mapState, mapMethod)(DiscGroupItems)

function mapState(state: RootState) {
  return {
    toAdds: state.admin.toAdds,
    fetchCount: state.admin.fetchCount,
  }
}

function mapMethod(dispatch: Dispatch) {
  return {
    pushToAdds(disc: Disc) {
      dispatch({type: 'pushToAdds', disc})
    },
    dropToAdds(disc: Disc) {
      dispatch({type: 'dropToAdds', disc})
    },
    setFetchCount(fetchCount: number) {
      dispatch({type: 'setFetchCount', fetchCount})
    }
  }
}
