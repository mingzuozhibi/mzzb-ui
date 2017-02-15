import { connect } from 'react-redux'
import AppBar from './AppBar'
import { showDrawer } from '../Drawer'
import { showAlert } from '../AlertDialog'
import { showLogin } from '../LoginDialog'
import { submitCheck, submitLogout } from '../action'

function mapStateToProps(state) {
  return {
    router: state.router,
    session: state.session,
  }
}

function mapDispatchToProps(dispatch) {
  dispatch(submitCheck())
  return {
    action: {
      doShowDrawer() {
        dispatch(showDrawer())
      },
      noSupport() {
        dispatch(showAlert('Unsupported Operation'))
      },
      doShowLogin() {
        dispatch(showLogin())
      },
      doLogout() {
        dispatch(submitLogout())
      }
    }
  }
}

const AppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar)

export default AppBarContainer
