import {connect} from 'react-redux'
import {showDrawer} from '../Drawer'
import {showAlert} from '../AlertDialog'
import {showLogin} from '../LoginDialog'
import {submitCheck, submitLogout} from '../action'
import AppBar from './AppBar'

function mapStateToProps(state) {
  return {
    isLogged: state.session.isLogged,
    title: state.router.title
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
