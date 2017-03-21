import { connect } from '../../connect'
import Sakura from './Sakura'

function mapDispatchToProps(dispatch) {
  return {}
}

const SakuraContainer = connect(
  mapDispatchToProps
)(Sakura)

export default SakuraContainer
