import {connect} from 'react-redux'
import Sakura from './Sakura'
import {discManager} from '../../manager'
import {updateSakura} from '../../module/sakura'
import {showAlertFrame} from '../../module/appbar'

function mapStateToProps(state) {
  return {
    data: state.sakura.data
  }
}

function fetchSakuraData(dispatch) {
  discManager.sakuraLists().then(json => {
    if (json.success) {
      dispatch(updateSakura(json.data))
    } else {
      showAlertFrame(json.message)
    }
  })
}

function mapDispatchToProps(dispatch) {
  fetchSakuraData(dispatch)
  return {
    doFetchSakuraData() {
      fetchSakuraData(dispatch)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
