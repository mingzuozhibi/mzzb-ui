import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AppSider } from './app-sider'
import { withRouter } from 'react-router-dom'
import { withViewport } from '../../hoc/Viewport'

function mapStateToProps(state: RootState) {
  return {
    viewSider: state.app.viewSider,
    userRoles: state.app.session.userRoles,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    clearReload() {
      dispatch({type: 'setReload'})
    },
    setViewSider(viewSider: boolean) {
      dispatch({type: 'setViewSider', viewSider})
    },
  }
}

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSider)

export default withRouter<any>(withViewport(Connected))
