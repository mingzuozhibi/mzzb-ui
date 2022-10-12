import { SubmitItem } from '#CC/form/SubmitItem'
import { useAjax } from '#CH/useAjax'
import { Button, Form, Input } from 'antd'

import { IDisc } from '#DT/disc'
import { amazonLink } from '#DU/disc-comps'
import { apiToDiscs } from '#RU/links'

interface FormEdit {
  rank: number
}

interface Props {
  disc: IDisc
  setDisc: (disc: IDisc) => void
}

export function DiscRank(props: Props) {
  const { disc, setDisc } = props

  const [isEdit, doEdit] = useAjax<IDisc>('patch')

  function doEditRank(form: FormEdit) {
    doEdit(apiToDiscs(`/${disc.id}`), '编辑碟片', {
      body: form,
      onSuccess: setDisc,
    })
  }

  return (
    <div className="disc-rank">
      <Form
        style={{ marginTop: 24 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ rank: disc.thisRank }}
        onFinish={doEditRank}
      >
        <Form.Item label="日文标题">
          <Input.TextArea readOnly={true} autoSize={true} value={disc.title} />
        </Form.Item>
        <Form.Item label="中文标题">
          <Input.TextArea readOnly={true} autoSize={true} value={disc.titlePc} />
        </Form.Item>
        <Form.Item label="当前排名" name="rank">
          <Input addonAfter={amazonLink(disc.asin)} type="number" />
        </Form.Item>
        <Form.Item label="前回排名">
          <Input readOnly={true} value={disc.prevRank} />
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
