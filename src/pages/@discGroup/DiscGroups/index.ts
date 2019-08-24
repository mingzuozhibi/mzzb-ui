import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../../@reducer'
import { DiscGroups } from './DiscGroups'

export default connect(mapState, mapMethod)(DiscGroups)

function mapState(state: RootState) {
  let hasRole = state.session.userRoles.includes('ROLE_BASIC')
  return {
    hasRole, isAdminMode: hasRole && state.admin.isAdminMode,
  }
}

function mapMethod(dispatch: Dispatch) {
  return {
    setAdminMode(isAdminMode: boolean) {
      dispatch({type: 'setAdminMode', isAdminMode})
    },
  }
}
