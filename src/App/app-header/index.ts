import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AppHeader } from './app-header'

function mapStateToProps(state: RootState) {
  return {
    current: state.current,
    isLogged: state.app.session.isLogged,
    viewSider: state.app.viewSider,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    reloadRequest() {
      dispatch({type: 'reloadRequest'})
    },
    showLogin() {
      dispatch({type: 'setViewLogin', viewLogin: true})
    },
    setViewSider(viewSider: boolean) {
      dispatch({type: 'setViewSider', viewSider})
    },
    sessionLogout() {
      dispatch({type: 'sessionLogoutRequest'})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHeader)
