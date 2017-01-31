import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Ajax from "./components/Ajax";

class AppLoginForm extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    handleChangeLogin: PropTypes.func.isRequired,
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
    const {handleChangeLogin} = this.context;

    let username = null;
    let password = null;

    const handleSubmit = () => {
      if (!username || !password) {
        this.handleStatus('You must input username and password');
        return;
      }
      Ajax.session.login(username, password).then(json => {
        if (json.success) {
          handleClose();
          handleChangeLogin();
        } else {
          this.handleStatus('Login failed! Check username and password');
        }
      });
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
          hintText="Enter Username"
          floatingLabelText="Username"
          onChange={(e, v)=>username = v}
        /><br />
        <TextField
          type="password"
          hintText="Enter Password"
          floatingLabelText="Password"
          onChange={(e, v)=>password = v}
        /><br />
        <div style={{color: 'red'}}>
          {this.state.message}
        </div>
      </Dialog>
    )
  }
}

export default AppLoginForm;
