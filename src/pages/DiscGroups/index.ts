import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { DiscGroups } from './DiscGroups'

export default connect(mapState, mapMethod)(DiscGroups)

function mapState(state: RootState) {
  return {
    hasRole: state.session.userRoles.includes('ROLE_BASIC'),
    isAdminMode: state.admin.isAdminMode,
  }
}

function mapMethod(dispatch: Dispatch) {
  return {
    setAdminMode(isAdminMode: boolean) {
      dispatch({type: 'setAdminMode', isAdminMode})
    },
  }
}
