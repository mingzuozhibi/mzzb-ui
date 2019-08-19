import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { TopDisc, OwnProps } from './topdisc'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.topdisc, ...ownProps
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onShowAll() {
      dispatch({type: 'topDisc_onShowAll'})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopDisc)
