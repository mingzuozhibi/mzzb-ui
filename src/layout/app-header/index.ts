import { connect } from 'react-redux'
import { RootState } from '../../@reducer'
import { AppHeader } from './app-header'

function mapStateToProps(state: RootState) {
  return {
    viewSider: state.layout.viewSider,
    isLogged: state.token?.user?.roles?.includes('Login') || false,
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHeader)
