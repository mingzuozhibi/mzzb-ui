import { connect } from 'react-redux'
import { RootState } from '../../@reducer'
import { AppSider } from './app-sider'

function mapStateToProps(state: RootState) {
  return {
    collapsed: !state.layout.viewSider,
    userRoles: state.session.userRoles,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setCollapsed(collapse: boolean) {
      dispatch({ type: 'setViewSider', viewSider: !collapse })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSider)
