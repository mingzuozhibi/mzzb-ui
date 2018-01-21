import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth'
import React from 'react'
import AppBar from '../component/AppBar'
import SideDrawer from '../component/SideDrawer'
import LoginFrame from '../component/LoginFrame'
import AlertFrame from '../component/AlertFrame'

function App({width, children}) {
  const contentStyle = {
    minHeight: '400px',
    paddingTop: '64px',
    paddingLeft: width < LARGE ? 0 : '256px',
    margin: width < MEDIUM ? '24px' : '48px 72px',
  }
  return (
    <MuiThemeProvider>
      <div id="app">
        <div id="header">
          <AppBar/>
          <SideDrawer isDocked={width >= LARGE}/>
          <AlertFrame/>
          <LoginFrame/>
        </div>
        <div id="content" style={contentStyle}>
          {children}
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default withWidth()(App)
