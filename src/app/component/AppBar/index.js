import {connect} from 'react-redux'
import {submitCheck, submitLogout} from '../action'
import * as appbar from '../../module/appbar'
import AppBar from './AppBar'

function mapStateToProps(state) {
  return {
    isLogged: state.session.isLogged,
    title: state.routing.title
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

const AppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar)

export default AppBarContainer
