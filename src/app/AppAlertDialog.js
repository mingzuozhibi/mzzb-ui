import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

class AppAlertDialog extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
  };

  render() {
    const {open, message, handleClose} = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label="Discard"
        primary={true}
        onTouchTap={handleClose}
      />,
    ];

    return (
      <Dialog
        open={open}
        actions={actions}
        onRequestClose={handleClose}
      >
        {message}
      </Dialog>
    )
  }
}

export default AppAlertDialog;
