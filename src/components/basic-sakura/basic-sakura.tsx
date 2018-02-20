import * as React from 'react'
import { Alert, Button, Input, Modal, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'
import { Icon } from '../../lib/icon'

import { Manager, Model } from '../../utils/manager'
import { BaseComponent, State } from '../BaseComponent'

interface SakuraModel extends Model {
  key: string
  title: string
  enabled: boolean
  sakuraUpdateDate: number
}

interface SakuraState extends State<SakuraModel> {
  formTitle?: string
}

export class BasicSakura extends BaseComponent<SakuraModel, SakuraState> {

  state: SakuraState = {}

  manager: Manager<SakuraModel> = new Manager('/api/basic/sakuras')

  formKey?: string

  saveSakura = async () => {
    if (!this.formKey) {
      Modal.warning({title: '请检查输入项', content: 'Key的格式必须为(yyyy-mm)'})
      return
    }

    const result = await this.manager.addOne({
      key: this.formKey, title: this.state.formTitle
    })

    this.saveModel('添加Sakura错误', result)
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
    this.listModelSupport(() => {
      return this.manager.findAll()
    })
  }

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

  render() {
    return (
      <div className="basic-sakura">
        <Tabs>
          <Tabs.TabPane tab="Sakura列表" key="1">
            {this.state.errors && (
              <Alert message={this.state.errors} type="error"/>
            )}
            {this.state.models && (
              <Table rows={this.state.models} columns={this.columns}/>
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
