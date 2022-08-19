import { RootState } from '##/@reducer'
import { connect } from 'react-redux'
import { AppFooter } from './app-footer'

function mapStateToProps(state: RootState) {
  return {
    viewLogin: state.layout.viewLogin,
    submiting: state.session.submiting,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setViewLogin(viewLogin: boolean) {
      dispatch({ type: 'setViewLogin', viewLogin })
    },
    sessionLogin(username: string, password: string) {
      dispatch({ type: 'sessionLoginRequest', username, password })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppFooter)
