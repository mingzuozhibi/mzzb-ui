import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Radio, Tabs } from 'antd'
import produce from 'immer'

import { useData } from '../../../hooks/useData'
import { useAjax } from '../../../hooks/useAjax'
import { formatTimeout } from '../../../funcs/format'
import { composeCompares } from '../../../funcs/compare'
import { CustomHeader } from '../../../comps/CustomHeader'
import { Column, Table } from '../../../comps/@table/Table'

import { compareSurp, compareTitle, discTitle } from '../../@funcs'
import { InjectToAdds, injectToAdds } from '../../@inject'
import { Disc, DiscGroup, RouteProps } from '../../@types'
import './DiscGroupItems.scss'
import request from '../../../funcs/request'

interface Data extends DiscGroup {
  discs: Disc[]
}

interface FormCreate {
  asin?: string
  title?: string
  discType?: string
  releaseDate?: string
}

const columns = 'id,asin,title,titlePc,surplusDays'

export default injectToAdds(DiscGroupItems)

function DiscGroupItems(props: InjectToAdds & RouteProps<{ key: string }>) {
  const { toAdds, pushToAdds, dropToAdds, fetchCount, setFetchCount, match } = props
  const findDiscsUrl = `/api/discGroups/key/${match.params.key}/discs?discColumns=${columns}`
  const [{ error, data }, handler, { modify }] = useData<Data>(findDiscsUrl)
  const [discSearching, doSearchDisc] = useAjax<Disc>('get')
  const [countSearching, doSearchCount] = useAjax<number>('get')
  const [, doPush] = useAjax<Disc>('post')
  const [, doDrop] = useAjax<Disc>('delete')
  const asinRef = useRef<string>()
  const [formCreate, setFormCreate] = useState<FormCreate>({})

  function searchDisc() {
    const asin = asinRef.current

    if (!asin) {
      Modal.warning({ title: '请检查输入项', content: `碟片ASIN必须输入` })
      return
    }

    if (toAdds.some((t) => t.asin === asin)) {
      Modal.warning({ title: '请检查输入项', content: `该碟片已存在于待选列表` })
      return
    }

    if (data!.discs.some((t) => t.asin === asin)) {
      Modal.warning({ title: '请检查输入项', content: `该碟片已存在于当前列表` })
      return
    }

    doSearchDisc(`/api/admin/searchDisc/${asin}`, '查询碟片', {
      onSuccess: pushToAdds,
    })
  }

  function createDisc() {
    const { asin, title, releaseDate, discType } = formCreate
    if (!asin) {
      Modal.warning({ title: '请检查输入项', content: `碟片ASIN必须输入` })
      return
    }
    if (!title) {
      Modal.warning({ title: '请检查输入项', content: `碟片标题必须输入` })
      return
    }
    if (!discType) {
      Modal.warning({ title: '请检查输入项', content: `碟片类型必须选择` })
      return
    }
    if (!releaseDate) {
      Modal.warning({ title: '请检查输入项', content: `发售日期必须输入` })
      return
    }
    if (!releaseDate.match(/\d{4}\/\d{1,2}\/\d{1,2}/)) {
      Modal.warning({
        title: '请检查输入项',
        content: `你输入的发售日期格式不正确，应该为：yyyy/M/d`,
      })
      return
    }
    request('/api/discs', { method: 'post', body: JSON.stringify(formCreate) })
      .then((result) => {
        if (result.success) {
          pushToAdds(result.data)
          setFormCreate({})
        } else {
          throw new Error(result.message)
        }
      })
      .catch((e) =>
        Modal.warning({
          title: '创建碟片失败',
          content: e.message,
        })
      )
  }

  function pushDisc(discGroupId: number, discId: number) {
    doPush(`/api/discGroups/${discGroupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: Disc) {
        dropToAdds(disc)
        modify(
          produce(data!, (draft: Data) => {
            draft.discs = [disc, ...data!.discs]
          })
        )
      },
    })
  }

  function dropDisc(discGroupId: number, discId: number) {
    doDrop(`/api/discGroups/${discGroupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: Disc) {
        pushToAdds(disc)
        modify(
          produce(data!, (draft: Data) => {
            draft.discs = data!.discs.filter((e) => e.id !== disc.id)
          })
        )
      },
    })
  }

  function fetchActiveCount() {
    doSearchCount('/api/admin/fetchCount', '查询抓取中的碟片数量', { onSuccess: setFetchCount })
  }

  function getPushCommand() {
    return {
      key: 'command',
      title: '添加',
      format: (t: Disc) => <FileAddOutlined onClick={() => pushDisc(data!.id, t.id)} />,
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (t: Disc) => <DeleteOutlined onClick={() => dropDisc(data!.id, t.id)} />,
    }
  }

  const title = data ? `管理碟片：${data.title}` : '载入中'

  return (
    <div className="DiscGroupItems">
      <CustomHeader header="管理碟片" title={title} error={error} handler={handler} />
      {data && (
        <>
          <Tabs>
            <Tabs.TabPane tab="查询碟片" key="1">
              <div className="input-wrapper">
                <Input
                  addonBefore="ASIN"
                  onChange={(e) => (asinRef.current = e.target.value)}
                  placeholder="请输入ASIN"
                />
              </div>
              <div className="input-wrapper button-group">
                <Button loading={discSearching} onClick={searchDisc}>
                  查找碟片
                </Button>
                <Button loading={countSearching} onClick={fetchActiveCount}>
                  {fetchCount !== undefined
                    ? `抓取中碟片数量(${fetchCount})`
                    : '查询抓取中的碟片数量'}
                </Button>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="手动创建" key="2">
              <div className="input-wrapper">
                <div className="input-label">
                  <span>日文标题</span>
                </div>
                <Input.TextArea
                  autoSize={true}
                  value={formCreate.title}
                  onChange={(e) => setFormCreate({ ...formCreate, title: e.target.value })}
                />
              </div>
              <div className="input-wrapper">
                <Input
                  addonBefore="Asin"
                  style={{ width: 180, marginRight: 12 }}
                  value={formCreate.asin}
                  onChange={(e) => setFormCreate({ ...formCreate, asin: e.target.value })}
                />
                <Input
                  addonBefore="日期"
                  style={{ width: 180 }}
                  value={formCreate.releaseDate}
                  onChange={(e) => setFormCreate({ ...formCreate, releaseDate: e.target.value })}
                />
              </div>
              <div className="input-wrapper">
                <Radio.Group
                  value={formCreate.discType}
                  onChange={(e) => setFormCreate({ ...formCreate, discType: e.target.value })}
                >
                  <Radio.Button value="Cd">CD</Radio.Button>
                  <Radio.Button value="Bluray">BD</Radio.Button>
                  <Radio.Button value="Dvd">DVD</Radio.Button>
                  <Radio.Button value="Auto">自动</Radio.Button>
                  <Radio.Button value="Other">未知</Radio.Button>
                </Radio.Group>
                <div style={{ marginTop: 20 }}>
                  <Button type="primary" onClick={() => createDisc()}>
                    创建碟片
                  </Button>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
          <Table rows={toAdds} cols={getColumns(getPushCommand())} title="待选列表" />
          <Table
            rows={data.discs}
            cols={getColumns(getDropCommand())}
            title={data.title}
            extraCaption={`更新于${formatTimeout(data.modifyTime)}前`}
            defaultSort={composeCompares([compareSurp, compareTitle])}
          />
        </>
      )}
    </div>
  )
}

function getColumns(extraColumn: Column<Disc>): Column<Disc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (t) => t.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin),
    },
    {
      key: 'surp',
      title: '天数',
      format: (t) => `${t.surplusDays}天`,
      compare: composeCompares([compareSurp, compareTitle]),
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
      compare: compareTitle,
    },
    extraColumn,
  ]
}

function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>
}
