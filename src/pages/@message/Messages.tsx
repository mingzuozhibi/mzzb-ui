import React, { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useData } from '../../hooks/useData'
import { safeCompare } from '../../funcs/compare'

import { Button, Checkbox, Radio } from 'antd'
import { Column, Table } from '../../comps/@table/Table'
import { CustomDate } from '../../comps/CustomDate'
import { StateRender } from '../../comps/StateRender'
import './Messages.scss'

const LEVELS = ['DEBUG', 'INFO', 'NOTIFY', 'SUCCESS', 'WARN', 'ERROR']
type Level = 'DEBUG' | 'INFO' | 'NOTIFY' | 'SUCCESS' | 'WARN' | 'ERROR'

export interface Message {
  id: number
  level: Level,
  content: string,
  createOn: number,
  acceptOn: number,
}

export default function Messages() {

  const location = useLocation()
  const history = useHistory()

  const params = new URLSearchParams(location.search)
  params.set('page', params.get('page') || '1')
  params.set('size', params.get('size') || '20')
  params.set('sort', params.get('sort') || 'id,desc')
  params.set('index', params.get('index') || 'Default')
  params.set('levels', params.get('levels') || LEVELS.join(','))

  const url = `/api/messages?${params}`
  const [state, handler] = useData<Message[]>(url)

  function onChangePage(page: number, size: number = 20) {
    params.set('page', String(page))
    params.set('size', String(size))
    history.push(location.pathname + '?' + params)
  }

  function onChangeLevels(levels: any[]) {
    params.set('levels', join(levels))
    history.push(location.pathname + '?' + params)
  }

  const onChangeIndex = (e: any) => {
    params.set('index', e.target.value)
    history.push(location.pathname + '?' + params)
  }

  const cols = useMemo(getCols, [])

  return (
    <StateRender
      title="系统日志"
      className="Messages"
      state={state}
      showPage="both"
      onChangePage={onChangePage}
      children={(
        <div>
          <div>
            <Button style={{ marginRight: 20 }} loading={handler.loading} onClick={handler.refresh}>刷新</Button>
            <Radio.Group defaultValue={params.get('index')} onChange={onChangeIndex} style={{ marginBottom: 10 }}>
              <Radio.Button value="Default">系统消息</Radio.Button>
              <Radio.Button value="User">用户消息</Radio.Button>
              <Radio.Button value="Test">测试消息</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <Checkbox.Group key="levels" onChange={onChangeLevels} value={params.get('levels')?.split(',')}>
              <Checkbox value="DEBUG">调试</Checkbox>
              <Checkbox value="INFO">信息</Checkbox>
              <Checkbox value="NOTIFY">通知</Checkbox>
              <Checkbox value="SUCCESS">成功</Checkbox>
              <Checkbox value="WARN">警告</Checkbox>
              <Checkbox value="ERROR">错误</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
      )}
      render={data => (
        <div className="MessagesContent">
          <div style={{ marginBottom: 10 }}>
            <Table cols={cols} rows={data} trClass={trClass} />
          </div>
        </div>
      )}
    />
  )
}

function getCols(): Column<Message>[] {
  return [
    {
      key: 'time',
      title: '时间',
      format: t => <CustomDate time={t.createOn} />
    },
    {
      key: 'level',
      title: '级别',
      format: t => t.level
    },
    {
      key: 'text',
      title: '消息内容',
      format: t => t.content
    },
  ]
}

function trClass(t: Message) {
  switch (t.level) {
    case 'DEBUG':
      return 'debug'
    case 'NOTIFY':
      return 'info'
    case 'SUCCESS':
      return 'success'
    case 'WARN':
      return 'warning'
    case 'ERROR':
      return 'danger'
    default:
      return 'undefined'
  }
}

const levelsCompare = safeCompare<string, number>({
  apply: t => LEVELS.indexOf(t),
  empty: n => n === -1,
  compare: (a, b) => a - b
})

function join(levels: string[]) {
  const sorted = [...levels]
  sorted.sort(levelsCompare)
  return sorted.join(',')
}
