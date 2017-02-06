import React, {PropTypes} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import spacing from "material-ui/styles/spacing";
import darkTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import withWidth, {MEDIUM, LARGE} from "material-ui/utils/withWidth";
import AppActionBar from "./styles/AppActionBar.jsx";
import AppNavDrawer from "./styles/AppNavDrawer.jsx";
import AppLoginDialog from "./styles/AppLoginDialog.jsx";
import AppAlertDialog from "./styles/AppAlertDialog.jsx";
import {activePage} from "./utils/Page";
import {sessionManager} from "./Api";

class Master extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    isLight: PropTypes.bool.isRequired,
    isLogged: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    muiTheme: PropTypes.object.isRequired,
    handleChangeLogin: PropTypes.func.isRequired,
    handleChangeTheme: PropTypes.func.isRequired,
    handleChangeAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      userName: null,
      loginOpen: false,
      alertOpen: false,
      alertText: null,
      drawerOpen: false,
    };
  }

  getChildContext() {
    return {
      isLight: this.state.isLight,
      isLogged: this.state.isLogged,
      userName: this.state.userName,
      muiTheme: this.state.muiTheme,
      handleChangeLogin: this.handleChangeLogin.bind(this),
      handleChangeTheme: this.handleChangeTheme.bind(this),
      handleChangeAlert: this.handleAlertDialog.bind(this),
    }
  }

  componentWillMount() {
    const isLight = localStorage.isLight !== "false";
    this.handleChangeTheme(isLight);
    this.handleChangeLogin();
  }

  async handleChangeLogin() {
    try {
      const json = await sessionManager.check();
      this.setState({
        isLogged: json.success,
        userName: json.username,
      });
    } catch (error) {
      this.handleAlertDialog(true, `Check Error: ${error.message}`);
    }
  }

  handleChangeTheme(isLight) {
    localStorage.isLight = isLight;
    this.setState({
      isLight: isLight,
      muiTheme: isLight ? getMuiTheme() : getMuiTheme(darkTheme),
    });
  }

  handleLoginDialog(open) {
    this.setState({
      loginOpen: open,
    })
  }

  handleAlertDialog(open, text) {
    this.setState({
      alertOpen: open,
      alertText: text,
    })
  }

  handleChangeDrawer(open) {
    this.setState({
      drawerOpen: open,
    })
  }

  getStyles(isMedium, isLarge) {
    const styles = {
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
    };
    if (isMedium || isLarge) {
      styles.content = {...styles.content, ...styles.contentWhenMedium}
    }
    if (isLarge) {
      styles.root.paddingLeft = 256;
    }
    return styles;
  }

  render() {
    const {children, location, width} = this.props;
    const {router} = this.context;
    const {muiTheme, loginOpen, alertOpen, alertText, drawerOpen} = this.state;

    const isMedium = (width === MEDIUM);
    const isLarge = (width === LARGE);
    const styles = this.getStyles(isMedium, isLarge);
    const page = activePage(router);

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper className="master">
          <AppActionBar
            barTitle={page.name}
            showMenuIcon={!isLarge}
            handleShowLogin={() => this.handleLoginDialog(true)}
            handleShowDrawer={() => this.handleChangeDrawer(true)}
          />
          <AppNavDrawer
            handleClose={() => this.handleChangeDrawer(false)}
            location={location}
            docked={isLarge}
            open={drawerOpen}
          />
          <AppLoginDialog
            handleClose={() => this.handleLoginDialog(false)}
            open={loginOpen}
          />
          <AppAlertDialog
            handleClose={() => this.handleAlertDialog(false)}
            open={alertOpen}
            message={alertText}
          />
          <div className="root" style={styles.root}>
            <div className="content" style={styles.content}>
              {children}
            </div>
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(Master);
