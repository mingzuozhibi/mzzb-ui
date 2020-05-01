import React, { useState, useCallback } from 'react'
import { Radio } from 'antd'
import { useTitle } from '../../hooks/hooks'
import Messages from './Messages'
import { useHistory, useRouteMatch } from 'react-router-dom'

export default function Console() {

  useTitle('系统日志')

  const history = useHistory()
  const match = useRouteMatch<{ index: string }>()

  const handleChange = useCallback((e) => {
    history.push(`/console/${e.target.value}`)
  }, [history])

  return (
    <div className="Console">
      <Radio.Group defaultValue="Default" onChange={handleChange} style={{ marginBottom: 10 }}>
        <Radio.Button value="Default">系统消息</Radio.Button>
        <Radio.Button value="User">用户消息</Radio.Button>
        <Radio.Button value="Test">测试消息</Radio.Button>
      </Radio.Group>
      <Messages index={match.params.index} />
    </div>
  )
}
