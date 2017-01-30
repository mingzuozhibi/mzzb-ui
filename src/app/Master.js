import React, {PropTypes} from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import withWidth from "material-ui/utils/withWidth";
import AppActionBar from "./AppActionBar";
import AppNavDrawer from "./AppNavDrawer";
import AppLoginForm from "./AppLoginForm";

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
    handleChangeTheme: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      handleChangeTheme: this.handleChangeTheme,
    }
  }

  state = {
    useLightTheme: true,
  };

  baseTheme() {
    return this.state.useLightTheme ? lightBaseTheme : darkBaseTheme;
  }

  handleChangeTheme(useLightTheme) {
    this.setState({
      useLightTheme: useLightTheme,
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
