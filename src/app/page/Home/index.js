import { connect } from '../../connect'
import Home from './Home'

function mapDispatchToProps(dispatch) {
  return {}
}

const HomeContainer = connect(
  mapDispatchToProps
)(Home)

export default HomeContainer
