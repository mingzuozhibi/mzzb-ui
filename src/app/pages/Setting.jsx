import React, {PropTypes} from "react";
import Paper from "material-ui/Paper";
import Toggle from "material-ui/Toggle";

export default class Setting extends React.Component {

  static contextTypes = {
    isLight: PropTypes.bool.isRequired,
    muiTheme: PropTypes.object.isRequired,
    handleChangeTheme: PropTypes.func.isRequired,
  };

  render() {
    const {isLight, handleChangeTheme} = this.context;
    const styles = {
      block: {
        padding: "20px 18px 4px 18px",
        maxWidth: 250,
      },
      toggle: {
        marginBottom: 16,
      },
    };
    return (
      <Paper style={styles.block}>
        <Toggle
          label={isLight ? "Light Theme" : "Dark Theme"}
          style={styles.toggle}
          defaultToggled={isLight}
          onToggle={(e, v) => handleChangeTheme(v)}
        />
      </Paper>
    );
  }

}
