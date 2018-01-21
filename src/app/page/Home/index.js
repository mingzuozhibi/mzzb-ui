import {connect} from 'react-redux'
import Home from './Home'

function mapStateToProps(state) {
  return {
    isLogged: state.session.isLogged,
    userName: state.session.userName
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
