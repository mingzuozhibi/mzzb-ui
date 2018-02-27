import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Public } from './public'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.public.models,
    detail: state.public.detail,
    message: state.public.message,
    pageInfo, ...ownProps
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Public)
