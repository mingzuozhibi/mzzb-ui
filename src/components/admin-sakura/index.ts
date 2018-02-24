import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminSakura } from './admin-sakura'
import { setReload } from '../../App/reducer'
import { MODEL_NAME } from './reducer'

function mapStateToProps(state: RootState) {
  return {
    models: state.adminSakura.models,
    errors: state.adminSakura.errors,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminSakura)
