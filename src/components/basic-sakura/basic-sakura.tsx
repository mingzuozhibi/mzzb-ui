import * as React from 'react'
import { Alert, Button, Input, Modal, Tabs } from 'antd'
import Table, { Column } from '../../lib/table'
import Icon from '../../lib/icon'
import './basic-sakura.css'

import { Manager, Model, Result } from '../../utils/manager'
import { AppState, default as App } from '../../App'
import produce from 'immer'

export interface BasicSakuraModel extends Model {
  key: string
  title: string
  enabled: boolean
  sakuraUpdateDate: number
}

interface BasicSakuraState {
  sakuras?: BasicSakuraModel[]
  message?: string
  title?: string
}

const formatTime = (sakuraUpdateDate: number) => {
  if (sakuraUpdateDate === 0) {
    return '从未更新'
  } else {
    const millis = new Date().getTime() - sakuraUpdateDate
    const minutes = Math.floor(millis / 60000)
    const hour = Math.floor(minutes / 60)
    const minute = Math.floor(minutes % 60)
    return `${hour}时${minute}分前`
  }
}

const columns: Column<BasicSakuraModel>[] = [
  {key: 'id', title: '#', format: (t) => t.id},
  {key: 'key', title: 'Key', format: (t) => t.key},
  {key: 'title', title: '标题', format: (t) => t.title},
  {key: 'enabled', title: '启用', format: (t) => t.enabled ? '是' : '否'},
  {key: 'sakuraUpdateDate', title: '上次更新', format: (t) => formatTime(t.sakuraUpdateDate)},
]

export class BasicSakura extends React.Component<{}, BasicSakuraState> {

  static contextTypes = App.childContextTypes

  manager: Manager<BasicSakuraModel> = new Manager('/api/basic/sakuras')

  constructor(props: {}) {
    super(props)

    this.state = {}
  }

  update = (reducer: (draft: BasicSakuraState) => void) => {
    this.setState((prevState => produce(prevState, reducer)))
  }

  listSakura = async () => {
    this.context.update((draft: AppState) => {
      draft.reload!.pending = true
    })

    const result: Result<BasicSakuraModel[]> = await this.manager.findAll()

    this.update(draft => {
      if (result.success) {
        draft.sakuras = result.data
        draft.message = undefined
      } else {
        draft.message = result.message
      }
    })

    this.context.update((draft: AppState) => {
      draft.reload!.pending = false
    })
  }

  saveSakura = async () => {
    const key = (document.querySelector('#save-key') as HTMLInputElement).value
    const title = (document.querySelector('#save-title') as HTMLInputElement).value
    if (!/\d{4}-\d{2}/.test(key)) {
      Modal.warning({title: '请检查输入项', content: 'Key的格式必须为(yyyy-mm)'})
    } else {
      const result = await this.manager.addOne({key, title})

      if (result.success) {
        this.update(draft => draft.sakuras!.push(result.data))
      } else {
        Modal.error({title: '添加Sakura错误', content: result.message})
      }
    }
  }

  formatSakuraTitle = () => {
    const value = (document.getElementById('save-key') as HTMLInputElement).value
    if (value && /\d{4}-\d{2}/.test(value)) {
      this.update(draft => {
        draft.title = `${value.substr(0, 4)}年${value.substr(5, 2)}月新番`
      })
    } else {
      this.update(draft => {
        draft.title = `请在上方输入Key (类似: 2018-04)`
      })
    }
  }

  async componentDidMount() {
    this.context.update((draft: AppState) => {
      draft.reload = {pending: true, handle: this.listSakura}
    })

    await this.listSakura()
  }

  render() {
    return (
      <div className="basic-sakura">
        <Tabs>
          <Tabs.TabPane tab="Sakura列表" key="1">
            {this.state.message && (
              <Alert message={this.state.message} type="error"/>
            )}
            {this.state.sakuras && (
              <Table rows={this.state.sakuras} columns={columns}/>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="添加Sakura" key="2">
            <div style={{padding: 10}}>
              <Input
                id="save-key"
                prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
                onKeyUp={this.formatSakuraTitle}
                placeholder="请输入Key (类似: 2018-04)"
              />
            </div>
            <div style={{padding: 10}}>
              <Input
                id="save-title"
                disabled={true}
                value={this.state.title}
                prefix={<Icon type="tag-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
              />
            </div>
            <div style={{padding: '5px 10px'}}>
              <Button type="primary" onClick={this.saveSakura}>添加Sakura</Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
