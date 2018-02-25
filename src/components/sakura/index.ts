import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Sakura } from './sakura'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.sakura.models,
    detail: state.sakura.detail,
    message: state.sakura.message,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
