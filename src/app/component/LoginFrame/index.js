import {connect} from 'react-redux'
import {alertWarning, hideLoginFrame, showAlertFrame} from '../../module/appbar'
import {submitLogin} from '../../module/session'
import LoginFrame from './LoginFrame'

function mapStateToProps(state) {
  return {
    isOpened: state.appbar.loginFrameOpen
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doHideLogin() {
      dispatch(hideLoginFrame())
    },
    doSubmit(username, password) {
      if (!username || !password) {
        dispatch(alertWarning({title: '请检查输入项', content: '你必须输入用户名和密码'}))
      } else {
        dispatch(submitLogin(username, password))
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFrame)
