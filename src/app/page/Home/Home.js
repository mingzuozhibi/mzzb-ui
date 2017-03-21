import React from 'react'

function Home({session}) {
  const {isLogged, userName} = session
  const helloMsg = isLogged
    ? `Hello ${userName}, You are logged.`
    : 'Hello guest, Please login.'
  return (
    <div id="home">
      <h3>{helloMsg}</h3>
    </div>
  )
}

export default Home
