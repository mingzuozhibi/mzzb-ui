import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { DiscGroupDetail } from './DiscGroupDetail'

export default connect(mapState, mapMethod)(DiscGroupDetail)

function mapState(state: RootState) {
  return {
    hasAdminRole: state.session.userRoles.includes('ROLE_ADMIN'),
  }
}

function mapMethod(dispatch: Dispatch) {
  return {}
}
