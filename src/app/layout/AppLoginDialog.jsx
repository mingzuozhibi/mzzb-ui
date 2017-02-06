import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import {sessionManager} from "../Api";

export default class AppLoginDialog extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    handleChangeLogin: PropTypes.func.isRequired,
    handleChangeAlert: PropTypes.func.isRequired,
  };

  state = {
    message: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.open == true) {
      this.handleStatus('');
    }
  }

  handleStatus(message) {
    this.setState({
      message: message,
    });
  }

  render() {
    const {open, handleClose} = this.props;
    const {handleChangeAlert, handleChangeLogin} = this.context;

    const handleSubmit = async() => {
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;

      try {
        if (!username || !password) {
          this.handleStatus('You must input username and password');
        }
        const json = await sessionManager.login(username, password);
        if (json.success) {
          handleClose();
          handleChangeLogin();
        } else {
          this.handleStatus('Login failed! Check username and password');
        }
      } catch (error) {
        handleChangeAlert(true, `Login Error: ${error.message}`);
      }
    };

    const handleEnter = (event) => {
      if (event.keyCode === 13) {
        handleSubmit();
      }
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label="Login"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleSubmit}
      />,
    ];

    return (
      <Dialog
        open={open}
        onRequestClose={handleClose}
        title="Login Form"
        actions={actions}
      >
        <TextField
          id="username"
          hintText="Enter Username"
          floatingLabelText="Username"
        /><br />
        <TextField
          id="password"
          type="password"
          hintText="Enter Password"
          floatingLabelText="Password"
          onKeyUp={handleEnter}
        /><br />
        <div style={{color: 'red'}}>
          {this.state.message}
        </div>
      </Dialog>
    )
  }
}
