import { connect } from 'react-redux'
import { RootState } from '../../@reducer'
import { AppFooter } from './app-footer'
import { encodePasswd } from '../../@version/passwd'
import { loginRequest } from '../../@version/token'

function mapStateToProps(state: RootState) {
  return {
    viewLogin: state.layout.viewLogin,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setViewLogin(viewLogin: boolean) {
      dispatch({ type: 'setViewLogin', viewLogin })
    },
    sessionLogin(username: string, password: string) {
      const encode = encodePasswd(username, password)
      dispatch(loginRequest({ username, password: encode }))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppFooter)
