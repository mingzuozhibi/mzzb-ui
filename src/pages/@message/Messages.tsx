import React, { useMemo } from 'react'
import { safeCompare } from '../../funcs/compare'
import { useSearch } from '../../hooks/useSearch'
import { useData } from '../../hooks/useData'

import { Button, Checkbox, Radio, Spin } from 'antd'
import { Column, Table } from '../../comps/@table/Table'
import { CustomDate } from '../../comps/CustomDate'
import { StateRender } from '../../comps/StateRender'
import './Messages.scss'

const LEVELS = ['DEBUG', 'INFO', 'NOTIFY', 'SUCCESS', 'WARN', 'ERROR']
type Level = 'DEBUG' | 'INFO' | 'NOTIFY' | 'SUCCESS' | 'WARN' | 'ERROR'

export interface Message {
  id: number
  level: Level
  content: string
  createOn: number
  acceptOn: number
}

const searchs = [
  { name: 'sort', init: 'id,desc' },
  { name: 'index', init: 'Default' },
  { name: 'levels', init: LEVELS.join(',') },
]

export default function Messages() {
  const { search, pushPath, getParam, setParam } = useSearch(searchs)

  const url = `/api/messages?${search}`
  const [state, handler] = useData<Message[]>(url)

  function onChangePage(page: number, size: number = 20) {
    setParam('page', String(page))
    setParam('size', String(size))
    pushPath()
  }

  function onChangeLevels(levels: any[]) {
    setParam('levels', join(levels))
    pushPath()
  }

  const onChangeIndex = (e: any) => {
    setParam('index', e.target.value)
    pushPath()
  }

  const cols = useMemo(getCols, [])

  const element = (
    <div>
      <div className="margin-spans" style={{ marginBottom: 10 }}>
        <span>
          <Button onClick={handler.refresh}>刷新</Button>
        </span>
        <span>{handler.loading && <Spin delay={200} />}</span>
        <span>
          <Radio.Group
            onChange={onChangeIndex}
            defaultValue={getParam('index')}
          >
            <Radio.Button value="Default">系统消息</Radio.Button>
            <Radio.Button value="User">用户消息</Radio.Button>
            <Radio.Button value="Test">测试消息</Radio.Button>
          </Radio.Group>
        </span>
      </div>
      <div>
        <Checkbox.Group
          onChange={onChangeLevels}
          defaultValue={getParam('levels')?.split(',')}
        >
          <Checkbox value="DEBUG">调试</Checkbox>
          <Checkbox value="INFO">信息</Checkbox>
          <Checkbox value="NOTIFY">通知</Checkbox>
          <Checkbox value="SUCCESS">成功</Checkbox>
          <Checkbox value="WARN">警告</Checkbox>
          <Checkbox value="ERROR">错误</Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  )

  return (
    <StateRender
      title="系统日志"
      className="Messages"
      showPage="both"
      onChangePage={onChangePage}
      state={state}
      children={element}
      render={(data) => (
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
      format: (t) => <CustomDate time={t.createOn} />,
    },
    {
      key: 'level',
      title: '级别',
      format: (t) => t.level,
    },
    {
      key: 'text',
      title: '消息内容',
      format: (t) => t.content,
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
  apply: (t) => LEVELS.indexOf(t),
  empty: (n) => n === -1,
  compare: (a, b) => a - b,
})

function join(levels: string[]) {
  const sorted = [...levels]
  sorted.sort(levelsCompare)
  return sorted.join(',')
}
