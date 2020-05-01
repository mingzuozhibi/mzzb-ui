import React, { useEffect } from 'react'
import { Layout, Popconfirm } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { CustomIcon } from '../../comps/CustomIcon'
import { SessionState } from '../../reducers/session'

interface AppHeaderProps {
  session: SessionState
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  sessionLogout: () => void
}

export function AppHeader(props: AppHeaderProps) {

  const {session, viewSider, showLogin, setViewSider, sessionLogout} = props

  return (
    <Layout.Header className="app-header">
      <CustomIcon iconNode={viewSider ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
                  className="header-icon" onClick={() => setViewSider(!viewSider)}/>
      <span style={{marginLeft: 24}}>在线人数: TODO</span>
      {session.isLogged ? (
        <Popconfirm title="你确定要登出吗？" okText="OK" cancelText="Cancel" placement="bottomRight" onConfirm={sessionLogout}>
          <CustomIcon iconType="icon-user" className="header-icon float-right"/>
        </Popconfirm>
      ) : (
        <CustomIcon iconType="icon-login" className="header-icon float-right" onClick={showLogin}/>
      )}
    </Layout.Header>
  )
}
