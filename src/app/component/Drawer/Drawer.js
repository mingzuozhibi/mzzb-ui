import React from 'react'
import MdDrawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import { List, ListItem, makeSelectable } from 'material-ui/List'
import './Drawer.css'

const SelectableList = makeSelectable(List);

function Drawer({state, props, action, pages}) {
  const {isOpened} = state
  const {location, isDocked} = props
  const {doHideDrawer, doSelectItem, doRedirect} = action

  const selectItems = Object.keys(pages).map(path =>
    <ListItem key={path} value={path} primaryText={pages[path]}/>
  )
  const doTouchHeader = (event) => {
    doSelectItem(event, '/')
  }

  return (
    <MdDrawer
      docked={isDocked}
      width={200}
      open={isOpened || isDocked}
      onRequestChange={doHideDrawer}
    >
      <div className="drawer__header" onTouchTap={doTouchHeader}>
        名作之壁
      </div>
      <SelectableList value={location.pathname} onChange={doSelectItem}>
        {selectItems}
      </SelectableList>
      <Divider />
      <SelectableList value="" onChange={doRedirect}>
        <Subheader>Resources</Subheader>
        <ListItem primaryText="GitHub" value="https://github.com/mingzuozhibi/mzzb-ui"/>
        <ListItem primaryText="名作之壁吧" value="http://tieba.baidu.com/f?kw=名作之壁&ie=utf-8"/>
      </SelectableList>
    </MdDrawer>
  )
}

export default Drawer
