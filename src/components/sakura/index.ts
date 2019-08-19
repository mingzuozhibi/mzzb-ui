import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Sakura } from './sakura'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.sakura, ...ownProps, session: state.app.session
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    switchToPc() {
      dispatch({type: 'switchToPcMode'})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
