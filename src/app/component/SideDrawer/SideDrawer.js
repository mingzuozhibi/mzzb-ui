import React from 'react'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import NativeDrawer from 'material-ui/Drawer'
import {List, ListItem, makeSelectable} from 'material-ui/List'
import {pages} from '../../constant'
import './Drawer.css'

const SelectableList = makeSelectable(List)

function Drawer({isDocked, isOpened, pathname, action}) {
  const {doHideDrawer, doSelectItem, doRedirect} = action

  const SelectItems = pages.map(page =>
    <ListItem key={page.path} value={page.path} primaryText={page.title}/>
  )
  const doTouchHeader = (event) => {
    doSelectItem(event, '/')
  }

  return (
    <div id="side_drawer">
      <NativeDrawer
        docked={isDocked}
        width={200}
        open={isOpened || isDocked}
        onRequestChange={doHideDrawer}
      >
        <div className="drawer__header" onClick={doTouchHeader}>
          名作之壁
        </div>
        <SelectableList value={pathname} onChange={doSelectItem}>
          {SelectItems}
        </SelectableList>
        <Divider/>
        <SelectableList value="" onChange={doRedirect}>
          <Subheader>Resources</Subheader>
          <ListItem primaryText="GitHub" value="https://github.com/mingzuozhibi/mzzb-ui"/>
          <ListItem primaryText="名作之壁吧" value="http://tieba.baidu.com/f?kw=名作之壁&ie=utf-8"/>
        </SelectableList>
      </NativeDrawer>
    </div>
  )
}

export default Drawer
