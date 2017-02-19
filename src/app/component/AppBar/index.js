import { connect } from '../../connect'
import AppBar from './AppBar'
import { showDrawer } from '../Drawer'
import { showAlert } from '../AlertDialog'
import { showLogin } from '../LoginDialog'
import { submitCheck, submitLogout } from '../action'

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
  mapDispatchToProps
)(AppBar)

export default AppBarContainer
