import React, {PropTypes} from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import withWidth, {MEDIUM, LARGE} from "material-ui/utils/withWidth";
import drakBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import spacing from "material-ui/styles/spacing";
import AppActionBar from "./components/AppActionBar.jsx";
import AppNavDrawer from "./components/AppNavDrawer.jsx";
import AppLoginDialog from "./components/AppLoginDialog.jsx";
import AppAlertDialog from "./components/AppAlertDialog.jsx";
import {getCurrentTitle} from "./utils/Page";
import Ajax from "./utils/Ajax";

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
      isLight: true,
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

  baseTheme(isLight) {
    if (isLight) {
      return lightBaseTheme;
    } else {
      return drakBaseTheme;
    }
  }

  componentWillMount() {
    const baseTheme = this.baseTheme(this.state.isLight);
    this.setState({
      muiTheme: getMuiTheme(baseTheme),
    });
    this.handleChangeLogin();
  }

  handleChangeLogin() {
    Ajax.session.check()
      .then(json => {
        this.setState({
          isLogged: json.success,
          userName: json.username,
        })
      })
  }

  handleChangeTheme(isLight) {
    const baseTheme = this.baseTheme(isLight);
    this.setState({
      isLight: isLight,
      muiTheme: getMuiTheme(baseTheme),
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

  static getStyles(isMedium, isLarge) {
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
    // load props
    const {
      children,
      location,
      width
    } = this.props;

    // load state
    const {
      muiTheme,
      loginOpen,
      alertOpen,
      alertText,
      drawerOpen,
    } = this.state;

    // load computed
    const isMedium = (width === MEDIUM);
    const isLarge = (width === LARGE);
    const styles = Master.getStyles(isMedium, isLarge);
    const barTitle = getCurrentTitle(this.context.router);

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="master">
          <AppActionBar
            barTitle={barTitle}
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
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(Master);
