import { Sakura } from './sakura'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'

function mapStateToProps(state: RootState) {
  return {
    models: state.sakura.models,
    errors: state.sakura.errors,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  dispatch({type: 'listSakuraRequest'})
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
