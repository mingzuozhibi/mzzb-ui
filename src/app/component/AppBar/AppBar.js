import React from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import NativeAppBar from 'material-ui/AppBar'

function AppBar({title, isLogged, action}) {
  const {noSupport, doLogout, doShowLogin, doShowDrawer} = action
  const Logged = (
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Refresh" onTouchTap={noSupport}/>
      <MenuItem primaryText="Help" onTouchTap={noSupport}/>
      <MenuItem primaryText="Sign out" onTouchTap={doLogout}/>
    </IconMenu>
  )
  const NoLog = (
    <FlatButton
      label="Login"
      onTouchTap={doShowLogin}
    />
  )
  return (
    <NativeAppBar
      title={title}
      style={{position: 'fixed', top: 0}}
      onLeftIconButtonTouchTap={doShowDrawer}
      iconElementRight={isLogged ? Logged : NoLog}
    />
  )
}

export default AppBar
