import React, {PropTypes} from "react";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";

export default class AppNavDrawer extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    docked: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  render() {
    const {open, docked, handleClose} = this.props;

    return (
      <Drawer
        docked={docked}
        width={200}
        open={open}
        onRequestChange={handleClose}
      >
        <MenuItem onTouchTap={handleClose}>Menu Item</MenuItem>
        <MenuItem onTouchTap={handleClose}>Menu Item 2</MenuItem>
      </Drawer>
    );
  }
}
