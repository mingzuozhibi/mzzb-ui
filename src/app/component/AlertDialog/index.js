import {connect} from 'react-redux'
import {hideAlertFrame} from '../../module/appbar'
import AlertDialog from './AlertDialog'

function mapStateToProps(state) {
  return {
    alertOpen: state.appbar.alertFrameOpen,
    alertText: state.appbar.alertText
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doHideAlert() {
      dispatch(hideAlertFrame())
    }
  }
}

const AlertDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertDialog)

export default AlertDialogContainer
