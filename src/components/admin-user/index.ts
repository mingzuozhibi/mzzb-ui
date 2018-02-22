import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminUser } from './admin-user'

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
    saveModel(model: {}) {
      dispatch({type: 'saveAdminUserRequest', model})
    },
    editModel(model: {}) {
      dispatch({type: 'editAdminUserRequest', model})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)
