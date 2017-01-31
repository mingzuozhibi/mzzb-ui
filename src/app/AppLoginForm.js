import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Ajax from "./components/Ajax"

class AppLoginForm extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    handleChangeLogin: PropTypes.func.isRequired,
  };

  render() {
    const {open, handleClose} = this.props;
    const {handleChangeLogin} = this.context;

    let username = null;
    let password = null;

    const handleSubmit = () => {
      if (username == null || password == null) {
        alert("username and password must input");
        return;
      }
      Ajax.session.login(username, password).then(() => {
        handleChangeLogin();
      });
      handleClose();
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
      </Dialog>
    )
  }
}

export default AppLoginForm;
