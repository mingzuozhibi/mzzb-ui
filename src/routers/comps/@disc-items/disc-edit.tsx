import { SubmitItem } from '#CC/form/SubmitItem'
import { useAjax } from '#CH/useAjax'
import { Button, Form, Input, Radio, Space } from 'antd'
import { TextAreaRef } from 'antd/lib/input/TextArea'
import { useRef } from 'react'

import { Rules } from '#DT/antd'
import { IDisc } from '#DT/disc'
import { apiToDiscs } from '#RU/links'
import { amazonLink } from '#DU/disc-comps'

interface FormEdit {
  titlePc: string
  discType: string
  releaseDate: string
}

const rules: Rules = {
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

interface Props {
  disc: IDisc
  setDisc: (disc: IDisc) => void
}

export function DiscEdit(props: Props) {
  const { disc, setDisc } = props

  const [isEdit, doEdit] = useAjax<IDisc>('put')

  function doEditDisc(form: FormEdit) {
    doEdit(apiToDiscs(`/${disc.id}`), '编辑碟片', {
      body: form,
      onSuccess: setDisc,
    })
  }

  const [form] = Form.useForm()
  const inputRef = useRef<TextAreaRef | null>(null)

  function appendTo(text: string) {
    const titlePc = form.getFieldValue('titlePc')
    form.setFieldValue('titlePc', `${titlePc}${text}`)
    inputRef.current?.focus()
  }

  return (
    <div className="disc-edit">
      <Form
        form={form}
        style={{ marginTop: 24 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        initialValues={disc}
        onFinish={doEditDisc}
      >
        <Form.Item label="日文标题">
          <Input.TextArea className="readonly" readOnly={true} autoSize={true} value={disc.title} />
        </Form.Item>
        <Form.Item label="中文标题" name="titlePc">
          <Input.TextArea ref={(ref) => (inputRef.current = ref)} autoSize={true} />
        </Form.Item>
        <Form.Item label="快捷操作">
          <Space>
            <Button onClick={() => appendTo('【尼限】')}>尼限</Button>
            <Button onClick={() => appendTo('全卷')}>全卷</Button>
            <Button onClick={() => appendTo('BD')}>BD</Button>
            <Button onClick={() => appendTo('DVD')}>DVD</Button>
            <Button onClick={() => appendTo('BOX')}>BOX</Button>
          </Space>
        </Form.Item>
        <Form.Item label="发售日期" name="releaseDate" rules={rules.releaseDate}>
          <Input addonAfter={amazonLink(disc.asin)} />
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
        <SubmitItem span={[5, 16]}>
          <Button type="primary" htmlType="submit" loading={isEdit}>
            提交修改
          </Button>
        </SubmitItem>
      </Form>
    </div>
  )
}
