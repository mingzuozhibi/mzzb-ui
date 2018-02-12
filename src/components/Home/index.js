import React from 'react'
import connect from '../../utils/connect'

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

function mapState(state) {
  return {
    isLogged: state.session.isLogged,
    userName: state.session.userName
  }
}

export default connect(mapState, undefined, Home)
