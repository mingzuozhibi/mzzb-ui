import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { NewDisc, OwnProps } from './newdisc'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.newdisc, ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDisc)
