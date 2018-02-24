import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Sakura } from './sakura'
import { setReload } from '../../App/reducer'
import { MODEL_NAME } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.sakura.models,
    detail: state.sakura.detail,
    message: state.sakura.message,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  dispatch(setReload(`list${MODEL_NAME}`))
  dispatch({type: `list${MODEL_NAME}Request`})
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
