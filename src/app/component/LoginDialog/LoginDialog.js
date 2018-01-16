import React from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

function LoginDialog({isOpened, doHideLogin, doSubmit}) {

  function handleSubmit() {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    doSubmit(username, password)
  }

  function handleEnter(event) {
    if (event.keyCode === 13) {
      handleSubmit()
    }
  }

  const buttons = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={doHideLogin}
    />,
    <FlatButton
      label="Login"
      primary={true}
      keyboardFocused={true}
      onTouchTap={handleSubmit}
    />,
  ]
  return (
    <Dialog
      open={isOpened}
      onRequestClose={doHideLogin}
      title="Login Form"
      actions={buttons}
    >
      <TextField
        id="username"
        hintText="Enter Username"
        floatingLabelText="Username"
      /><br/>
      <TextField
        id="password"
        type="password"
        hintText="Enter Password"
        floatingLabelText="Password"
        onKeyUp={handleEnter}
      /><br/>
    </Dialog>
  )
}

export default LoginDialog
