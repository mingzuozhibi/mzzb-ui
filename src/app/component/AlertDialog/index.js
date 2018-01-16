import {connect} from 'react-redux'
import {showAlert, hideAlert} from './module/action'
import AlertDialog from './AlertDialog'

function mapStateToProps(state) {
  return {
    alertOpen: state.alert.isOpened,
    alertText: state.alert.message
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doHideAlert() {
      dispatch(hideAlert())
    }
  }
}

const AlertDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertDialog)

export default AlertDialogContainer

export {showAlert}
