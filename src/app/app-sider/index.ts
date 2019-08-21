import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { AppSider } from './app-sider'
import { withRouter } from 'react-router-dom'

function mapStateToProps(state: RootState) {
  return {
    viewSider: state.app.viewSider,
    userRoles: state.app.session.userRoles,
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

export default withRouter<any>(Connected)
