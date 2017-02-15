import { connect } from 'react-redux'
import Sakura from './Sakura'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

const SakuraContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)

export default SakuraContainer
