import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { Sakura } from './sakura'
import { setReload } from '../../App/reducer'
import { MODEL_NAME } from './reducer'

function mapStateToProps(state: RootState) {
  return {
    models: state.sakura.models,
    message: state.sakura.message,
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
