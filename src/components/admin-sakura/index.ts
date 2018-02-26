import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminSakura, OwnProps } from './admin-sakura'
import { MODEL_NAME } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.adminSakura.models,
    message: state.adminSakura.message,
    current: state.current!,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
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
