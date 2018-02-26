import * as React from 'react'
import { Alert, Button, Checkbox, Input, Modal, Radio, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'
import { Link } from '../../lib/link'
import { Icon } from '../../lib/icon'
import { Helmet } from 'react-helmet'

import { formatTimeout } from '../../utils/format'
import { AdminSakuraModel, AdminSakuraState } from './reducer'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { CurrentState } from '../../App/current'

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

export type OwnProps = RouteComponentProps<{}>

interface AdminSakuraProps extends AdminSakuraState, OwnProps {
  current: CurrentState
  saveModel: (model: {}) => void
  editModel: (model: {}) => void
}

export function AdminSakura(props: AdminSakuraProps) {

  function saveModel() {
    const key = formSave.key
    const title = formSave.title
    const viewType = formSave.viewType

    if (!key) {
      Modal.warning({title: '请检查输入项', content: '列表索引必须输入'})
      return
    }

    if (!title) {
      Modal.warning({title: '请检查输入项', content: '列表标题必须输入'})
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
      Modal.warning({title: '请检查输入项', content: '你必须输入列表索引'})
      return
    }

    if (!title) {
      Modal.warning({title: '请检查输入项', content: '你必须输入列表标题'})
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
        title: '索引',
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
    <div className="admin-sakura">
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => (
            <div className="with-models">
              <Helmet>
                <title>{props.current.route.text} - 名作之壁吧</title>
              </Helmet>
              <Tabs>
                <Tabs.TabPane tab="所有列表" key="1">
                  {props.message && (
                    <Alert message={props.message} type="error"/>
                  )}
                  {props.models && (
                    <Table rows={props.models} columns={getColumns()}/>
                  )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="添加列表" key="2">
                  <div className="input-wrapper">
                    <Input
                      prefix={<Icon type="key"/>}
                      defaultValue={formSave.key}
                      onChange={(e) => formSave.key = e.target.value}
                      placeholder="请输入列表索引"
                    />
                  </div>
                  <div className="input-wrapper">
                    <Input
                      prefix={<Icon type="tag-o"/>}
                      defaultValue={formSave.title}
                      onChange={(e) => formSave.title = e.target.value}
                      placeholder="请输入列表标题"
                    />
                  </div>
                  <div className="input-wrapper">
                    <span className="input-label">显示类型</span>
                    <Radio.Group
                      options={['SakuraList', 'PublicList', 'PrivateList']}
                      defaultValue={formSave.viewType}
                      onChange={e => formSave.viewType = e.target.value}
                    />
                  </div>
                  <div className="input-wrapper">
                    <Button type="primary" onClick={saveModel}>添加Sakura</Button>
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          )}
        />
      </Switch>
    </div>
  )

  function showEditModal(model: AdminSakuraModel) {
    formEdit.key = model.key
    formEdit.title = model.title
    formEdit.viewType = model.viewType
    formEdit.enabled = model.enabled

    Modal.confirm({
      title: '编辑列表',
      okText: '保存',
      okType: 'primary',
      onOk: () => editModel(model.id),
      cancelText: '取消',
      content: (
        <div>
          <div className="input-wrapper">
            <Input
              prefix={<Icon type="key"/>}
              defaultValue={formEdit.key}
              onChange={e => formEdit.key = e.target.value}
              placeholder="请输入列表索引"
            />
          </div>
          <div className="input-wrapper">
            <Input
              prefix={<Icon type="tag-o"/>}
              defaultValue={formEdit.title}
              onChange={e => formEdit.title = e.target.value}
              placeholder="请输入列表标题"
            />
          </div>
          <div className="input-wrapper">
            <span className="input-label">显示类型</span>
            <Radio.Group
              options={['SakuraList', 'PublicList', 'PrivateList']}
              defaultValue={formEdit.viewType}
              onChange={e => formEdit.viewType = e.target.value}
            />
          </div>
          <div className="input-wrapper">
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
