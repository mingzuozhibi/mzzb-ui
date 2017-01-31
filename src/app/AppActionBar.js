import React, {PropTypes} from "react";
import AppBar from "material-ui/AppBar";
import MenuItem from "material-ui/MenuItem";
import IconMenu from "material-ui/IconMenu";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

class AppActionBar extends React.Component {

  static contextTypes = {
    isLogged: PropTypes.bool.isRequired,
  };

  render() {
    const {isLogged} = this.context;
    const loggedElement = (
      <FlatButton
        label="Login"
      />
    );
    const iconButton = <IconButton><MoreVertIcon /></IconButton>;
    const origin = {horizontal: 'right', vertical: 'top'};
    const loginElement = (
      <IconMenu
        iconButtonElement={iconButton}
        targetOrigin={origin}
        anchorOrigin={origin}
      >
        <MenuItem primaryText="Refresh"/>
        <MenuItem primaryText="Help"/>
        <MenuItem primaryText="Sign out"/>
      </IconMenu>
    );
    return (
      <AppBar
        title="Home"
        iconElementRight={isLogged ? loggedElement : loginElement}
      />
    )
  }
}

export default AppActionBar;
