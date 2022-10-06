import { useAjax } from '#CH/useAjax'
import { Rules } from '#DT/antd'
import { Button, Form, Input, Radio } from 'antd'

import { apiToDiscs } from '#RU/links'
import { IDisc } from '#DT/disc'

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

  return (
    <div className="disc-edit">
      <Form
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
          <Input.TextArea autoSize={true} />
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
        <Form.Item wrapperCol={{ offset: 5 }}>
          <Button type="primary" htmlType="submit" loading={isEdit}>
            提交修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
