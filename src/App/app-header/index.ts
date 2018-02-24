import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AppHeader } from './app-header'
import { Reload } from '../reducer'

function mapStateToProps(state: RootState) {
  return {
    reload: state.app.reload,
    isLogged: state.app.session.isLogged,
    viewSider: state.app.viewSider,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  dispatch({type: 'sessionQueryRequest'})
  return {
    dispatch(reload: Reload) {
      if (reload.action) {
        dispatch(reload.action)
      } else {
        dispatch({type: `${reload.refresh}Request`})
      }
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
