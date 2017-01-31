import React, {PropTypes} from "react";
import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import {List, ListItem, makeSelectable} from "material-ui/List";

const SelectableList = makeSelectable(List);

export default class AppNavDrawer extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    docked: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const {open, docked, handleClose} = this.props;
    const {router} = this.context;

    const handleSelect = (event, value) => {
      router.push(value);
      handleClose();
    };

    const handleRedirect = (event, value) => {
      document.open(value);
    };

    return (
      <Drawer
        docked={docked}
        width={200}
        open={open}
        onRequestChange={handleClose}
      >
        <SelectableList onChange={handleSelect}>
          <ListItem value="/home" primaryText="Home"/>
          <ListItem value="/sakura" primaryText="Sakura"/>
          <ListItem value="/disclist" primaryText="DiscList"/>
          <ListItem value="/favourite" primaryText="Favourite"/>
        </SelectableList>
        <Divider />
        <SelectableList value="" onChange={handleRedirect}>
          <Subheader>Resources</Subheader>
          <ListItem primaryText="GitHub" value="https://github.com/mingzuozhibi/mzzb-ui"/>
          <ListItem primaryText="名作之壁吧" value="http://tieba.baidu.com/f?kw=名作之壁&ie=utf-8"/>
        </SelectableList>
      </Drawer>
    );
  }
}
