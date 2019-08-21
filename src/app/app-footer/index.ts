import { connect } from 'react-redux'
import { RootState } from '../../reducers'
import { AppFooter } from './app-footer'

function mapStateToProps(state: RootState) {
  return {
    viewLogin: state.app.viewLogin,
    submiting: state.app.submiting,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setViewLogin(viewLogin: boolean) {
      dispatch({type: 'setViewLogin', viewLogin})
    },
    sessionLogin(username: string, password: string) {
      dispatch({type: 'sessionLoginRequest', username, password})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppFooter)
