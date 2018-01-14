import { connect } from '../../connect'
import Sakura from './Sakura'
import { discManager } from '../../manager'
import { showAlert } from '../../component/action'
import { updateSakuraData } from "./module/action";

function fetchSakuraData(dispatch) {
  discManager.sakuraLists().then(json => {
    if (json.success) {
      dispatch(updateSakuraData(json.data))
    } else {
      showAlert(json.message)
    }
  })
}

function mapDispatchToProps(dispatch) {
  fetchSakuraData(dispatch)
  return {
    doFetchSakuraData() {
      fetchSakuraData(dispatch);
    }
  }
}

const SakuraContainer = connect(
  mapDispatchToProps
)(Sakura)

export default SakuraContainer
