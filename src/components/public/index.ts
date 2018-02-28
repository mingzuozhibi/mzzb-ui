import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Public } from './public'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.public, ...ownProps
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Public)
