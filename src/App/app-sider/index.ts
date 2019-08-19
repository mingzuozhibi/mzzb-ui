import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AppSider, OwnProps } from './app-sider'
import { withRouter } from 'react-router-dom'
import { withViewport } from '../../hoc/Viewport'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    viewSider: state.app.viewSider,
    userRoles: state.app.session.userRoles,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
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
