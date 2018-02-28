import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminSakura, OwnProps } from './admin-sakura'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...ownProps, ...state.adminSakura,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    saveModel(model: {}) {
      dispatch({type: `save${pageInfo.pageModel}Request`, model})
    },
    editModel(model: {}) {
      dispatch({type: `edit${pageInfo.pageModel}Request`, model})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminSakura)
