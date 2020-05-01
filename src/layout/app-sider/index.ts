import { connect } from 'react-redux'
import { RootState } from '../../@reducer'
import { AppSider } from './app-sider'
import { withRouter } from 'react-router-dom'

function mapStateToProps(state: RootState) {
  return {
    collapsed: !state.layout.viewSider,
    userRoles: state.token?.user?.roles || [],
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setCollapsed(collapse: boolean) {
      dispatch({type: 'setViewSider', viewSider: !collapse})
    },
  }
}

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSider)

export default withRouter(Connected)
