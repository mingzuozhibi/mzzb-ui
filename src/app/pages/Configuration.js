import React, {PropTypes} from "react";
import Toggle from "material-ui/Toggle";

export default class Configuration extends React.Component {

  static contextTypes = {
    useLightTheme: PropTypes.bool.isRequired,
    handleChangeTheme: PropTypes.func.isRequired,
  };

  render() {
    const {useLightTheme, handleChangeTheme} = this.context;
    const styles = {
      toggle: {
        marginBottom: 16,
      },
    };
    return (
      <Toggle
        label="Simple"
        style={styles.toggle}
        defaultToggled={useLightTheme}
        onToggle={(e,v)=>handleChangeTheme(v)}
      />
    )
  }

}
