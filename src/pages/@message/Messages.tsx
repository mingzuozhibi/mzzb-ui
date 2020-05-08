import React, { useState, useMemo } from 'react'
import { Button, Checkbox, Radio } from 'antd'
import { useData } from '../../hooks/useData'
import { CustomDate } from '../../comps/CustomDate'
import { Column, Table } from '../../comps/@table/Table'
import './Messages.scss'
import { StateRender } from '../../comps/StateRender'
import { useHistory, useParams } from 'react-router-dom'
import { safeCompare } from '../../funcs/compare'

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

  const history = useHistory()
  const params = useParams<{ index: string, levels: string }>()
  const [{ page, size }, setPage] = useState({ page: 1, size: 20 })
  const url = `/api/messages/${params.index}?levels=${params.levels}&page=${page}&size=${size}&sort=id,desc`
  const [state, handler] = useData<Message[]>(url)

  function onChangePage(page: number, size: number = 20) {
    setPage({ page, size })
    window.scroll(0, 0)
  }

  function onChangeLevels(levels: any[]) {
    const sorted = [...levels]
    sorted.sort(levelsCompare)
    history.push(`/messages/${params.index}/${sorted.join(',')}`)
    onChangePage(1, size)
  }

  const onChangeIndex = (e: any) => {
    history.push(`/messages/${e.target.value}/${params.levels}`)
    onChangePage(1, size)
  }

  const cols = useMemo(getCols, [])

  return (
    <StateRender
      title="系统日志"
      className="Messages"
      state={state}
      onChangePage={onChangePage}
      children={(
        <div>
          <div>
            <Button style={{ marginRight: 20 }} loading={handler.loading} onClick={handler.refresh}>刷新</Button>
            <Radio.Group defaultValue={params.index} onChange={onChangeIndex} style={{ marginBottom: 10 }}>
              <Radio.Button value="Default">系统消息</Radio.Button>
              <Radio.Button value="User">用户消息</Radio.Button>
              <Radio.Button value="Test">测试消息</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <Checkbox.Group key="levels" onChange={onChangeLevels} value={params.levels.split(',')}>
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
