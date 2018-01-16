import {connect} from 'react-redux'
import {push as pushPath} from 'react-router-redux'
import {hideSideDrawer} from '../../module/appbar'
import Drawer from './Drawer'

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
        dispatch(pushPath(path))
      },
      doRedirect(event, path) {
        window.open(path)
      },
    }
  }
}

const DrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)

export default DrawerContainer

export {pushPath}
