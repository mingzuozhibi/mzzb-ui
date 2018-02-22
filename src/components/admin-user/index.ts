import { AdminUser } from './admin-user'

import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'

function mapStateToProps(state: RootState) {
  return {
    models: state.adminUser.models,
    errors: state.adminUser.errors,
    bodyWidth: 600
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  dispatch({type: 'listAdminUserRequest'})
  return {
    saveUser(user: {}) {
      dispatch({type: 'saveAdminUserRequest', user})
    },
    editUser(user: {}) {
      dispatch({type: 'editAdminUserRequest', user})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)
