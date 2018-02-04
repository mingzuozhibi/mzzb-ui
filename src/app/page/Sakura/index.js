import {connect} from 'react-redux'
import Sakura from './Sakura'
import {discManager, fetchHandler} from '../../manager'
import {updateSakura} from '../../module/sakura'
import {showAlertFrame} from '../../module/appbar'

function mapStateToProps(state) {
  return {
    data: state.sakura.data
  }
}

function fetchSakuraData() {
  return fetchHandler({
    fetchCall: () => discManager.sakuraLists(),
    fetchDone: (json, dispatch) => {
      if (json.success) {
        dispatch(updateSakura(json.data))
      } else {
        dispatch(showAlertFrame(json.message))
      }
    }
  })
}

function mapDispatchToProps(dispatch) {
  dispatch(fetchSakuraData())
  return {
    doFetchData() {
      dispatch(fetchSakuraData())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)
