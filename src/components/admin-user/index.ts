import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminUser, OwnProps } from './admin-user'
import { pageInfo } from './reducer'
import { withViewport } from '../../hoc/Viewport'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.adminUser, ...ownProps
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveModel(model: {}) {
      dispatch({type: `save${pageInfo.pageModel}Request`, model})
    },
    editModel(id: number, model: {}) {
      dispatch({type: `edit${pageInfo.pageModel}Request`, id, model})
    },
  }
}

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)

export default withViewport(Connected)
