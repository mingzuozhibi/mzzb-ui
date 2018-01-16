import {connect} from 'react-redux'
import {hideAlertFrame} from '../../module/appbar'
import AlertFrame from './AlertFrame'

function mapStateToProps(state) {
  return {
    frameOpen: state.appbar.alertFrameOpen,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertFrame)
