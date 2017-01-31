import React, {PropTypes} from "react";

class Home extends React.Component {

  static contextTypes = {
    isLogged: PropTypes.bool.isRequired,
    userName: PropTypes.string,
  };

  render() {
    const {isLogged, userName} = this.context;
    return (
      <h3>Hello, {isLogged ? userName : 'Guest'}.</h3>
    )
  }
  
}

export default Home;
