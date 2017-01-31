import React, {PropTypes} from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import withWidth, {MEDIUM, LARGE} from "material-ui/utils/withWidth";
import spacing from "material-ui/styles/spacing";
import AppActionBar from "./AppActionBar";
import AppNavDrawer from "./AppNavDrawer";
import AppLoginForm from "./AppLoginForm";
import AppAlertDialog from "./AppAlertDialog";
import Ajax from "./components/Ajax";

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
    isLogged: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    handleChangeLogin: PropTypes.func.isRequired,
    handleChangeTheme: PropTypes.func.isRequired,
    handleChangeAlert: PropTypes.func.isRequired,
  };

  state = {
    useLightTheme: true,
    isLogged: false,
    userName: null,
    drawerOpen: false,
    loginOpen: false,
    alertOpen: false,
    alertText: null,
  };

  getChildContext() {
    return {
      isLogged: this.state.isLogged,
      userName: this.state.userName,
      handleChangeLogin: this.handleChangeLogin.bind(this),
      handleChangeTheme: this.handleChangeTheme.bind(this),
      handleChangeAlert: this.handleAlertDialog.bind(this),
    }
  }

  componentWillMount() {
    this.handleChangeLogin();
  }

  baseTheme() {
    return this.state.useLightTheme ? lightBaseTheme : darkBaseTheme;
  }

  handleChangeTheme(useLightTheme) {
    this.setState({
      useLightTheme: useLightTheme,
    })
  }

  handleChangeDrawer(open) {
    this.setState({
      drawerOpen: open,
    })
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

  handleLoginForm(open) {
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

  getStyles() {
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

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  }

  render() {
    const muiTheme = getMuiTheme(this.baseTheme());
    const {width} = this.props;
    const {drawerOpen, loginOpen, alertOpen, alertText} = this.state;

    const styles = this.getStyles();
    const isLarge = (width === LARGE);
    if (isLarge) {
      styles.root.paddingLeft = 256;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="master">
          <AppActionBar
            showMenuIcon={!isLarge}
            handleShowLogin={() => this.handleLoginForm(true)}
            handleShowDrawer={() => this.handleChangeDrawer(true)}
          />
          <AppNavDrawer
            handleClose={() => this.handleChangeDrawer(false)}
            docked={isLarge}
            open={drawerOpen}
          />
          <AppLoginForm
            handleClose={() => this.handleLoginForm(false)}
            open={loginOpen}
          />
          <AppAlertDialog
            handleClose={() => this.handleAlertDialog(false)}
            open={alertOpen}
            message={alertText}
          />
          <div style={styles.root}>
            <div style={styles.content}>
              {this.props.children}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(Master);
