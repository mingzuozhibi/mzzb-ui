import { connect } from '../../connect'
import { push as pushPath } from 'react-router-redux'
import Drawer from './Drawer'
import { showDrawer, hideDrawer } from './module/action'

const pages = {
  '/home': 'Home',
  '/sakura': 'Sakura',
}

const extraProps = {
  pages
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
  mapDispatchToProps, extraProps
)(Drawer)

export default DrawerContainer

function getTitle(path) {
  return pages[path] || 'Home'
}

export { showDrawer, getTitle, pushPath }
