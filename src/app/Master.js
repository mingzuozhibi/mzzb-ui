import React, {PropTypes} from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import withWidth from "material-ui/utils/withWidth";
import AppActionBar from "./AppActionBar";
import AppNavDrawer from "./AppNavDrawer";
import AppLoginForm from "./AppLoginForm";
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
  };

  state = {
    useLightTheme: true,
    isLogged: false,
    userName: null,
  };

  getChildContext() {
    return {
      isLogged: this.state.isLogged,
      userName: this.state.userName,
      handleChangeLogin: this.handleChangeLogin,
      handleChangeTheme: this.handleChangeTheme,
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

  handleChangeLogin() {
    Ajax.session.check()
      .then(json => {
        this.setState({
          isLogged: json.success,
          userName: json.username,
        })
      })
  }

  render() {
    const muiTheme = getMuiTheme(this.baseTheme());
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="master">
          <AppActionBar />
          <AppNavDrawer />
          <AppLoginForm />
          <div className="root">
            <div className="content">
              {this.props.children}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(Master);
