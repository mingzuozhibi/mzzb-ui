import React from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import NativeAppBar from 'material-ui/AppBar'

function AppBar({barTitle, isLogged, action}) {
  const {noSupport, doLogout, doShowLogin, doShowDrawer} = action
  const Logged = (
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Refresh" onClick={noSupport}/>
      <MenuItem primaryText="Help" onClick={noSupport}/>
      <MenuItem primaryText="Sign out" onClick={doLogout}/>
    </IconMenu>
  )
  const NoLog = (
    <FlatButton
      label="Login"
      onClick={doShowLogin}
    />
  )
  return (
    <div id="appbar">
      <NativeAppBar
        title={barTitle}
        style={{position: 'fixed', top: 0}}
        onLeftIconButtonClick={doShowDrawer}
        iconElementRight={isLogged ? Logged : NoLog}
      />
    </div>
  )
}

export default AppBar
