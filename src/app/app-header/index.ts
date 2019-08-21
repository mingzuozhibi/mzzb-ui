import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { AppHeader } from './app-header'

function mapStateToProps(state: RootState) {
  return {
    session: state.app.session,
    viewSider: state.app.viewSider,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
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
