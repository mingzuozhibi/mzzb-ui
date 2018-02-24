import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminUser } from './admin-user'
import { withViewport } from '../../hoc/Viewport'
import { setReload } from '../../App/reducer'
import { MODEL_NAME } from './reducer'

function mapStateToProps(state: RootState) {
  return {
    models: state.adminUser.models,
    errors: state.adminUser.errors,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  dispatch(setReload(`list${MODEL_NAME}`))
  dispatch({type: `list${MODEL_NAME}Request`})
  return {
    saveModel(model: {}) {
      dispatch({type: `save${MODEL_NAME}Request`, model})
    },
    editModel(model: {}) {
      dispatch({type: `edit${MODEL_NAME}Request`, model})
    },
  }
}

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)

export default withViewport(Connected)
