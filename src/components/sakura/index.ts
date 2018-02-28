import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Sakura } from './sakura'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.sakura, ...ownProps
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Sakura)
