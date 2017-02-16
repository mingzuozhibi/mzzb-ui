import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import withWidth, { MEDIUM, LARGE } from 'material-ui/utils/withWidth'
import React from 'react'
import AppBar from '../component/AppBar'
import Drawer from '../component/Drawer'
import AlertDialog from '../component/AlertDialog'
import LoginDialog from '../component/LoginDialog'

class App extends React.Component {

  getStyles(width) {
    const styles = {
      root: {
        minHeight: '400px',
        paddingTop: '64px',
      },
      content: {
        margin: '24px',
      }
    }
    if (width >= MEDIUM) {
      styles.content.margin = '48px 72px'
    }
    if (width >= LARGE) {
      styles.root.paddingLeft = '256px'
    }
    return styles
  }

  render() {
    const {children, width} = this.props
    const styles = this.getStyles(width)
    const isDocked = width >= LARGE
    return (
      <MuiThemeProvider>
        <div className="app__page">
          <div className="app__header">
            <AppBar/>
            <Drawer isDocked={isDocked}/>
            <AlertDialog/>
            <LoginDialog/>
          </div>
          <div className="app__root" style={styles.root}>
            <div className="app__content" style={styles.content}>
              {children}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }

}

export default withWidth()(App)
