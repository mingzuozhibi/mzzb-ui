import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { TopDisc, OwnProps } from './topdisc'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.topdisc, ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopDisc)
