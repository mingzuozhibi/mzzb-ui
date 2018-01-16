import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

function AlertDialog({alertOpen, alertText, doHideAlert}) {
  const buttons = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={doHideAlert}
    />,
    <FlatButton
      label="Discard"
      primary={true}
      onTouchTap={doHideAlert}
    />,
  ];
  return (
    <Dialog
      open={alertOpen}
      style={{zIndex: 2000}}
      actions={buttons}
      onRequestClose={doHideAlert}
    >
      {alertText}
    </Dialog>
  )
}

export default AlertDialog
