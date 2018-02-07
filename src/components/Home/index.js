import React from 'react'
import {connect} from 'react-redux'

function Home({isLogged, userName}) {
  const helloMsg = isLogged
    ? `Hello ${userName}, You are logged.`
    : 'Hello guest, Please login.'
  return (
    <div id="home">
      <h3>{helloMsg}</h3>
    </div>
  )
}

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
