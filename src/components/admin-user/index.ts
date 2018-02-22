import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminUser } from './admin-user'
import { withViewport } from '../../hoc/Viewport'

function mapStateToProps(state: RootState) {
  return {
    models: state.adminUser.models,
    errors: state.adminUser.errors,
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

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)

export default withViewport(Connected)
