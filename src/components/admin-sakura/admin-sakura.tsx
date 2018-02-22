import * as React from 'react'
import { Alert, Button, Checkbox, Input, Modal, Radio, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'
import { Link } from '../../lib/link'
import { Icon } from '../../lib/icon'

import { formatTimeout } from '../../utils/format'
import { AdminSakuraModel, AdminSakuraState } from './reducer'

interface FormSave {
  key?: string
  title?: string
  viewType?: string
}

interface FormEdit extends FormSave {
  enabled?: boolean
}

const formSave: FormSave = {}
const formEdit: FormEdit = {}

interface AdminSakuraProps extends AdminSakuraState {
  saveModel: (model: {}) => void
  editModel: (model: {}) => void
}

export function AdminSakura(props: AdminSakuraProps) {

  function saveModel() {
    const key = formSave.key
    const title = formSave.title
    const viewType = formSave.viewType

    if (!key) {
      Modal.warning({title: '请检查输入项', content: 'Sakura\'Key必须输入'})
      return
    }

    if (!title) {
      Modal.warning({title: '请检查输入项', content: 'Sakura标题必须输入'})
      return
    }

    if (!viewType) {
      Modal.warning({title: '请检查输入项', content: '你必须选择一个显示类型'})
      return
    }

    props.saveModel({key, title, viewType})
  }

  function editModel(id: number) {
    const key = formEdit.key
    const title = formEdit.title
    const viewType = formEdit.viewType
    const enabled = formEdit.enabled

    if (!key) {
      Modal.warning({title: '请检查输入项', content: '你必须输入Sakura\'Key'})
      return
    }

    if (!title) {
      Modal.warning({title: '请检查输入项', content: '你必须输入Sakura标题'})
      return
    }

    props.editModel({id, key, title, viewType, enabled})
  }

  function getColumns(): Column<AdminSakuraModel>[] {
    return [
      {
        key: 'id',
        title: '#',
        format: (t) => t.id
      },
      {
        key: 'key',
        title: 'Key',
        format: (t) => t.key
      },
      {
        key: 'title',
        title: '标题',
        format: (t) => t.title
      },
      {
        key: 'enabled',
        title: '启用',
        format: (t) => t.enabled ? '是' : '否'
      },
      {
        key: 'viewType',
        title: '显示类型',
        format: (t) => t.viewType
      },
      {
        key: 'modifyTime',
        title: '上次更新',
        format: (t) => formatModifyTime(t)
      },
      {
        key: 'control',
        title: '功能',
        format: (t) => <Link onClick={() => showEditModal(t)}>编辑</Link>
      },
    ]
  }

  function formatModifyTime(t: AdminSakuraModel) {
    return t.modifyTime == null ? '从未更新' : formatTimeout(t.modifyTime)
  }

  return (
    <div className="basic-sakura">
      <Tabs>
        <Tabs.TabPane tab="Sakura列表" key="1">
          {props.errors && (
            <Alert message={props.errors} type="error"/>
          )}
          {props.models && (
            <Table rows={props.models} columns={getColumns()}/>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="添加Sakura" key="2">
          <div style={{padding: 10}}>
            <Input
              prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
              onChange={(e) => formSave.key = e.target.value}
              placeholder="请输入Sakura'Key"
            />
          </div>
          <div style={{padding: 10}}>
            <Input
              prefix={<Icon type="tag-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
              onChange={(e) => formSave.title = e.target.value}
              placeholder="请输入Sakura标题"
            />
          </div>
          <div style={{padding: 10}}>
            <span style={{paddingRight: 10}}>显示类型</span>
            <Radio.Group
              options={['SakuraList', 'PublicList', 'PrivateList']}
              onChange={e => formSave.viewType = e.target.value}
            />
          </div>
          <div style={{padding: '5px 10px'}}>
            <Button type="primary" onClick={saveModel}>添加Sakura</Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )

  function showEditModal(model: AdminSakuraModel) {
    formEdit.key = model.key
    formEdit.title = model.title
    formEdit.viewType = model.viewType
    formEdit.enabled = model.enabled

    Modal.confirm({
      title: '编辑Sakura',
      okText: '保存',
      okType: 'primary',
      onOk: () => editModel(model.id),
      cancelText: '取消',
      content: (
        <div>
          <div style={{padding: 10}}>
            <Input
              prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
              defaultValue={formEdit.key}
              onChange={e => formEdit.key = e.target.value}
              placeholder="请输入Sakura'key"
            />
          </div>
          <div style={{padding: 10}}>
            <Input
              prefix={<Icon type="tag-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
              defaultValue={formEdit.title}
              onChange={e => formEdit.title = e.target.value}
              placeholder="请输入Sakura标题"
            />
          </div>
          <div style={{padding: 10}}>
            <span style={{paddingRight: 10}}>显示类型</span>
            <Radio.Group
              options={['SakuraList', 'PublicList', 'PrivateList']}
              defaultValue={formEdit.viewType}
              onChange={e => formEdit.viewType = e.target.value}
            />
          </div>
          <div style={{padding: 10}}>
            <Checkbox
              defaultChecked={formEdit.enabled}
              onChange={e => formEdit.enabled = e.target.checked}
            >
              启用
            </Checkbox>
          </div>
        </div>
      ),
    })
  }
}
