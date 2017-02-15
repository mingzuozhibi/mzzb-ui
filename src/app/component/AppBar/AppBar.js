import React from 'react'
import MdAppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

function AppBar({session, router, action}) {
  const {isLogged} = session
  const {title} = router
  const {noSupport, doLogout, doShowLogin, doShowDrawer} = action
  return (
    <MdAppBar
      title={title}
      style={{position: "fixed", top: 0}}
      onLeftIconButtonTouchTap={doShowDrawer}
      iconElementRight={isLogged ? (
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{horizontal: "right", vertical: "top"}}
            anchorOrigin={{horizontal: "right", vertical: "top"}}
          >
            <MenuItem primaryText="Refresh" onTouchTap={noSupport}/>
            <MenuItem primaryText="Help" onTouchTap={noSupport}/>
            <MenuItem primaryText="Sign out" onTouchTap={doLogout}/>
          </IconMenu>
        ) : (
          <FlatButton
            label="Login"
            onTouchTap={doShowLogin}
          />
        )}
    />
  )
}

export default AppBar
