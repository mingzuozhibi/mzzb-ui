import { connect } from '../../connect'
import AlertDialog from './AlertDialog'
import { showAlert, hideAlert } from './module/action'

function mapDispatchToProps(dispatch) {
  return {
    action: {
      doHideAlert() {
        dispatch(hideAlert())
      }
    }
  }
}

const AlertDialogContainer = connect(
  mapDispatchToProps
)(AlertDialog)

export default AlertDialogContainer

export { showAlert }
