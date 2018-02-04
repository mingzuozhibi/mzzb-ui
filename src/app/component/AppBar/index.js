import {connect} from 'react-redux'
import {submitCheck, submitLogout} from '../../module/session'
import * as appbar from '../../module/appbar'
import AppBar from './AppBar'

function mapStateToProps(state) {
  return {
    barTitle: state.routing.title,
    isLogged: state.session.isLogged,
  }
}

function mapDispatchToProps(dispatch) {
  dispatch(submitCheck())
  return {
    action: {
      doShowDrawer() {
        dispatch(appbar.showSideDrawer())
      },
      noSupport() {
        dispatch(appbar.showAlertFrame('Unsupported Operation'))
      },
      doShowLogin() {
        dispatch(appbar.showLoginFrame())
      },
      doLogout() {
        dispatch(submitLogout())
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar)
