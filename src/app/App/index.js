import {connect} from 'react-redux'
import {hideSideDrawer, showSideDrawer} from '../module/appbar'
import App from './App'
import {redirectTo} from '../module/routing'

function mapStateToProps(state) {
  return {
    pathname: state.routing.pathname,
    showSider: state.appbar.sideDrawerOpen,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doHideSider() {
      dispatch(hideSideDrawer())
    },
    doShowSider() {
      dispatch(showSideDrawer())
    },
    doSelectItem(path) {
      dispatch(redirectTo(path))
    },
    doRedirect(path) {
      window.open(path)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
