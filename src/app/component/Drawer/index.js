import { connect } from 'react-redux'
import { push as pushPath } from 'react-router-redux'
import Drawer from './Drawer'
import { showDrawer, hideDrawer } from './module/action'

const pages = {
  '/home': 'Home',
  '/sakura': 'Sakura',
}

function getTitle(path) {
  return pages[path] || 'Home'
}

function mapStateToProps(state) {
  return {
    state: state.drawer, pages
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: {
      doHideDrawer() {
        dispatch(hideDrawer())
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

export { showDrawer, getTitle, pushPath }
