import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminUser, OwnProps } from './admin-user'
import { pageInfo } from './reducer'
import { withViewport } from '../../hoc/Viewport'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    models: state.adminUser.models,
    message: state.adminUser.message,
    pageInfo, ...ownProps
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

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)

export default withViewport(Connected)
