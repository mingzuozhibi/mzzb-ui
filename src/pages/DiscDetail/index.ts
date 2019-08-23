import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { DiscDetail } from './DiscDetail'

export default connect(mapState, mapMethod)(DiscDetail)

function mapState(state: RootState) {
  return {
    hasRole: state.session.userRoles.includes('ROLE_BASIC'),
  }
}

function mapMethod(dispatch: Dispatch) {
  return {}
}
