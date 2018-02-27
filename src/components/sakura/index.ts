import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Sakura } from './sakura'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.sakura.models,
    detail: state.sakura.detail,
    message: state.sakura.message,
    pageInfo, ...ownProps
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Sakura)
