import {connect} from 'react-redux'
import {showAlertFrame, hideLoginFrame} from '../../module/appbar'
import {submitLogin} from '../action'
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
      try {
        if (!username || !password) {
          dispatch(showAlertFrame('You must input username and password'))
        } else {
          dispatch(submitLogin(username, password, hideLoginFrame()))
        }
      } catch (error) {
        dispatch(showAlertFrame(`Error: ${error.message}`))
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFrame)
