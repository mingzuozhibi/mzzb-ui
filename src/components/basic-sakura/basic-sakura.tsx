import * as React from 'react'
import { Alert, Button, Input, Modal, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'
import { Icon } from '../../lib/icon'

import { Manager, Model } from '../../utils/manager'
import { AppState } from '../../App'
import { BaseComponent } from '../BaseComponent'

interface SakuraModel extends Model {
  key: string
  title: string
  enabled: boolean
  sakuraUpdateDate: number
}

interface State {
  sakuras?: SakuraModel[]
  message?: string
  formTitle?: string
}

export class BasicSakura extends BaseComponent<State> {

  state: State = {}

  manager: Manager<SakuraModel> = new Manager('/api/basic/sakuras')

  formKey?: string

  columns: Column<SakuraModel>[] = [
    {key: 'id', title: '#', format: (t) => t.id},
    {key: 'key', title: 'Key', format: (t) => t.key},
    {key: 'title', title: '标题', format: (t) => t.title},
    {key: 'enabled', title: '启用', format: (t) => t.enabled ? '是' : '否'},
    {key: 'sakuraUpdateDate', title: '上次更新', format: (t) => this.formatTime(t)},
  ]

  formatTime = (sakura: SakuraModel) => {
    if (sakura.sakuraUpdateDate === 0) {
      return '从未更新'
    } else {
      const millis = new Date().getTime() - sakura.sakuraUpdateDate
      const minutes = Math.floor(millis / 60000)
      const hour = Math.floor(minutes / 60)
      const minute = Math.floor(minutes % 60)
      return `${hour}时${minute}分前`
    }
  }

  listSakura = async () => {
    this.context.update((draft: AppState) => {
      draft.reload!.pending = true
    })

    const result = await this.manager.findAll()

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
    if (!this.formKey) {
      Modal.warning({title: '请检查输入项', content: 'Key的格式必须为(yyyy-mm)'})
      return
    }

    const result = await this.manager.addOne({
      key: this.formKey, title: this.state.formTitle
    })

    if (result.success) {
      this.update(draft => draft.sakuras!.push(result.data))
    } else {
      Modal.error({title: '添加Sakura错误', content: result.message})
    }
  }

  checkKey = (value: string) => {
    const exec = /^(\d{4})-(\d{2})$/.exec(value)
    this.update(draft => {
      if (exec) {
        draft.formTitle = `${exec[1]}年${exec[2]}月新番`
      } else {
        draft.formTitle = `请在上方输入Key (类似: 2018-04)`
      }
    })
    this.formKey = exec ? value : undefined
  }

  componentWillMount() {
    this.listModels = this.listSakura
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
              <Table rows={this.state.sakuras} columns={this.columns}/>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="添加Sakura" key="2">
            <div style={{padding: 10}}>
              <Input
                prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
                onChange={(e) => this.checkKey(e.target.value)}
                placeholder="请输入Key (类似: 2018-04)"
              />
            </div>
            <div style={{padding: 10}}>
              <Input
                disabled={true}
                value={this.state.formTitle}
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
