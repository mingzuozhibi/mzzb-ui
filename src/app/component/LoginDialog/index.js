import {connect} from 'react-redux'
import LoginDialog from './LoginDialog'
import {showLogin, hideLogin} from './module/action'
import {submitLogin} from '../action'
import {showAlert} from '../AlertDialog/'

function mapStateToProps(state) {
  return {
    isOpened: state.appbar.login.isOpened
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doHideLogin() {
      dispatch(hideLogin())
    },
    doSubmit(username, password) {
      try {
        if (!username || !password) {
          dispatch(showAlert('You must input username and password'))
        } else {
          dispatch(submitLogin(username, password, hideLogin()))
        }
      } catch (error) {
        dispatch(showAlert(`Error: ${error.message}`))
      }
    }
  }
}

const LoginDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginDialog)

export default LoginDialogContainer

export {showLogin}
