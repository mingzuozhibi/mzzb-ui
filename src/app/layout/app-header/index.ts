import { RootState } from '#A/reducer'
import { connect } from 'react-redux'
import { AppHeader } from './app-header'

function mapStateToProps(state: RootState) {
  return {
    session: state.session,
    viewSider: state.layout.viewSider,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    showLogin() {
      dispatch({ type: 'setViewLogin', viewLogin: true })
    },
    setViewSider(viewSider: boolean) {
      dispatch({ type: 'setViewSider', viewSider })
    },
    sessionLogout() {
      dispatch({ type: 'sessionLogoutRequest' })
    },
    refreshSession() {
      dispatch({ type: 'sessionQueryRequest' })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader)
