import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

function AlertFrame({frameOpen, alertText, doHideAlert}) {
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
  ]
  return (
    <div id="alert_frame">
      <Dialog
        open={frameOpen}
        style={{zIndex: 2000}}
        actions={buttons}
        onRequestClose={doHideAlert}
      >
        {alertText}
      </Dialog>
    </div>
  )
}

export default AlertFrame
