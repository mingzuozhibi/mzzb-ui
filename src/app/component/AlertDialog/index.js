import { connect } from 'react-redux'
import AlertDialog from './AlertDialog'
import { showAlert, hideAlert } from './module/action'

function mapStateToProps(state) {
  return {
    state: state.alert
  }
}

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
  mapStateToProps,
  mapDispatchToProps
)(AlertDialog)

export default AlertDialogContainer

export { showAlert }
