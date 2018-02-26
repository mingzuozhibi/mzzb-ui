import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, Public } from './public'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.public.models,
    detail: state.public.detail,
    message: state.public.message,
    current: state.current!,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Public)
