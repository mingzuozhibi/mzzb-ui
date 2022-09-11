import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzLink } from '#C/link/MzLink'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useAjax } from '#H/useAjax'
import { useOnceService } from '#H/useOnce'
import { safeWarpper } from '#U/domain'
import { Button, Form, Input, Modal, Radio, Space, Tabs } from 'antd'
import dayjs from 'dayjs'
import { useLocation } from 'react-router-dom'

import { linkToAmazonDeatil } from '#A/links'
import { pushToAdds } from '#F/local'
import { Rules } from '#T/antd'
import { IComing, IDisc } from '#T/disc'
import { ToAddsTable } from '../@to-add-list/to-adds-table'

interface FormCreate {
  asin: string
  title: string
  discType: string
  releaseDate: string
}

const rules: Rules = {
  title: [
    {
      required: true,
      message: '必须输入碟片标题',
    },
  ],
  asin: [
    {
      required: true,
      message: '必须输入碟片ASIN',
    },
    {
      pattern: /^[A-Z0-9]{10}$/,
      message: '格式必须为[A-Z0-9]的10位文本',
    },
  ],
  releaseDate: [
    {
      required: true,
      message: '必须输入发售日期',
    },
    {
      pattern: /^\d{4}\/\d{1,2}\/\d{1,2}$/,
      message: '格式必须为[YYYY/M/D]',
    },
  ],
  discType: [
    {
      required: true,
      message: '必须选择碟片类型',
    },
  ],
}

export default function DiscAdd() {
  useOnceService(() => {
    window.scroll(0, 0)
  })

  const dispatch = useAppDispatch()
  const [isGet, doGet] = useAjax<IDisc>('get')
  const [isPost, doPost] = useAjax<IDisc>('post')
  const toAdds = useAppSelector((state) => state.local.toAdds)

  const onSearch = (form: FormCreate) => {
    if (toAdds.map((disc) => disc.asin).includes(form.asin)) {
      Modal.warn({ title: '校验失败', content: '指定的ASIN已存在' })
      return
    }
    doGet(`/api/discs/asin/${form.asin}`, '查询碟片', {
      onSuccess: (disc: IDisc) => dispatch(pushToAdds(disc)),
    })
  }

  const onCreate = (form: FormCreate) => {
    if (toAdds.map((disc) => disc.asin).includes(form.asin)) {
      Modal.warn({ title: '校验失败', content: '指定的ASIN已存在' })
      return
    }
    doPost(`/api/discs`, '创建碟片', {
      body: form,
      onSuccess: (disc: IDisc) => dispatch(pushToAdds(disc)),
    })
  }

  const [form] = Form.useForm<FormCreate>()
  const setDateNow = () => form.setFieldValue('releaseDate', dayjs().format('YYYY/M/D'))

  const location = useLocation()
  const coming = location.state as IComing | undefined

  return (
    <div className="DiscAdd" style={{ maxWidth: 650 }}>
      <MzTopbar
        title="创建碟片"
        subTitle={safeWarpper(coming?.asin, (asin) => (
          <MzLink href={linkToAmazonDeatil(asin)} title="点击打开日亚页面" />
        ))}
      />
      <Tabs type="card" defaultActiveKey={coming ? 'create' : 'search'}>
        <Tabs.TabPane key="search" tab="查询碟片">
          <Form
            style={{ marginTop: 24 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={toDisc(coming) ?? {}}
            onFinish={onSearch}
          >
            <Form.Item label="碟片ASIN" name="asin" rules={rules.asin}>
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Button type="primary" htmlType="submit" loading={isGet}>
                查询碟片
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane key="create" tab="创建碟片">
          <Form
            form={form}
            style={{ marginTop: 24 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={toDisc(coming) ?? {}}
            onFinish={onCreate}
          >
            <Form.Item label="碟片标题" name="title" rules={rules.title}>
              <Input.TextArea autoSize={true} />
            </Form.Item>
            <Form.Item label="碟片ASIN" name="asin" rules={rules.asin}>
              <Input />
            </Form.Item>
            <Form.Item label="发售日期" name="releaseDate" rules={rules.releaseDate}>
              <Input />
            </Form.Item>
            <Form.Item label="碟片类型" name="discType" rules={rules.discType}>
              <Radio.Group>
                <Radio.Button value="Cd">CD</Radio.Button>
                <Radio.Button value="Bluray">BD</Radio.Button>
                <Radio.Button value="Dvd">DVD</Radio.Button>
                <Radio.Button value="Auto">自动</Radio.Button>
                <Radio.Button value="Other">未知</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Space size="large">
                <Button type="primary" htmlType="submit" loading={isPost}>
                  创建碟片
                </Button>
                <Button onClick={setDateNow}>填充日期</Button>
              </Space>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
      <ToAddsTable />
    </div>
  )
}

function toDisc(coming?: IComing) {
  return safeWarpper(coming, (coming) => ({
    title: coming.title,
    asin: coming.asin,
    discType: toDiscType(coming.type),
  }))
}

function toDiscType(type: string) {
  switch (type) {
    case '4K':
    case 'Blu-ray':
      return 'Bluray'
    case 'DVD':
      return 'Dvd'
    case 'CD':
      return 'Cd'
  }
}
