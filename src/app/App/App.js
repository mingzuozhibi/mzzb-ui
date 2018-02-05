import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import withWidth, {LARGE, MEDIUM} from 'material-ui/utils/withWidth'
import React from 'react'
import AppBar from '../component/AppBar'
import SideDrawer from '../component/SideDrawer'
import LoginFrame from '../component/LoginFrame'

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
