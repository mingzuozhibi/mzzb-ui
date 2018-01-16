import {connect} from 'react-redux'
import {hideSideDrawer} from '../../module/appbar'
import {redirectTo} from '../../module/routing'
import SideDrawer from './SideDrawer'

function mapStateToProps(state) {
  return {
    isOpened: state.appbar.sideDrawerOpen,
    pathname: state.routing.pathname,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: {
      doHideDrawer() {
        dispatch(hideSideDrawer())
      },
      doSelectItem(event, path) {
        dispatch(redirectTo(path))
      },
      doRedirect(event, path) {
        window.open(path)
      },
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideDrawer)
