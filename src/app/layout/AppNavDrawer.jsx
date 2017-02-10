import React, {PropTypes} from "react";
import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import {cyan500} from "material-ui/styles/colors";
import {spacing, typography, zIndex} from "material-ui/styles";
import {List, ListItem, makeSelectable} from "material-ui/List";
import {allPages} from "../utils/Page";

const SelectableList = makeSelectable(List);

export default class AppNavDrawer extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    docked: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const {open, docked, location, handleClose} = this.props;
    const {router} = this.context;

    const styles = {
      logo: {
        cursor: "pointer",
        fontSize: 24,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: cyan500,
        paddingLeft: spacing.desktopGutter,
        marginBottom: 8,
      },
    };

    const handleSelect = (event, value) => {
      router.push(value);
      handleClose();
    };

    const handleHeader = () => {
      router.push("/");
      handleClose();
    };

    const handleRedirect = (event, value) => {
      window.open(value);
    };

    return (
      <Drawer
        docked={docked}
        width={200}
        open={open || docked}
        onRequestChange={handleClose}
        containerStyle={{zIndex: zIndex.drawer - 100}}
      >
        <div style={styles.logo} onTouchTap={handleHeader}>
          名作之壁
        </div>
        <SelectableList value={location.pathname} onChange={handleSelect}>
          {
            allPages().map(page =>
              <ListItem key value={page.href} primaryText={page.name}/>
            )
          }
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
