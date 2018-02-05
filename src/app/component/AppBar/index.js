import {connect} from 'react-redux'
import {submitCheck, submitLogout} from '../../module/session'
import {alertError, showLoginFrame, showSideDrawer} from '../../module/appbar'
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
        dispatch(showSideDrawer())
      },
      noSupport() {
        dispatch(alertError({title: '不支持的操作', content: '该操作暂未实现，敬请期待'}))
      },
      doShowLogin() {
        dispatch(showLoginFrame())
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
