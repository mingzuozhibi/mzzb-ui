import { useAjax } from '##/hooks'
import { isEmpty } from '#F/domain'
import { Disc } from '#P/@types'
import { Button, Input, Modal, Radio } from 'antd'
import { useState } from 'react'

interface FormCreate {
  asin?: string
  title?: string
  discType?: string
  releaseDate?: string
}

interface Props {
  pushToAdds: (disc: Disc) => void
}

export default function CreateDisc(Props: Props) {
  const [form, setForm] = useState<FormCreate>({})
  const [posting, createDisc] = useAjax<Disc>('post')

  function doCreateDisc() {
    const { asin, title, releaseDate, discType } = form

    if (isEmpty(title)) {
      Modal.warning({ title: '请检查输入项', content: `碟片标题必须输入` })
      return
    }

    if (isEmpty(asin)) {
      Modal.warning({ title: '请检查输入项', content: `碟片ASIN必须输入` })
      return
    }

    if (!asin.match(/^[A-Z0-9]{10}$/)) {
      Modal.warning({ title: '请检查输入项', content: `你输入的ASIN格式不正确` })
      return
    }

    if (isEmpty(releaseDate)) {
      Modal.warning({ title: '请检查输入项', content: `发售日期必须输入` })
      return
    }

    if (!releaseDate.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
      Modal.warning({
        title: '请检查输入项',
        content: `你输入的发售日期格式不正确，应该为：yyyy/M/d`,
      })
      return
    }

    if (isEmpty(discType)) {
      Modal.warning({ title: '请检查输入项', content: `碟片类型必须选择` })
      return
    }

    createDisc('/api/discs', '创建碟片', {
      body: form,
      onSuccess: Props.pushToAdds,
    })
  }

  return (
    <div className="CreateDisc">
      <div className="input-wrapper">
        <div className="input-label">
          <span>日文标题</span>
        </div>
        <Input.TextArea
          autoSize={true}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value.trim() })}
          placeholder="请输入碟片标题"
        />
      </div>
      <div className="input-wrapper">
        <Input
          addonBefore="Asin"
          style={{ width: 180, marginRight: 12 }}
          value={form.asin}
          onChange={(e) => setForm({ ...form, asin: e.target.value.trim() })}
          placeholder="请输入ASIN"
        />
        <Input
          addonBefore="日期"
          style={{ width: 180 }}
          value={form.releaseDate}
          onChange={(e) => setForm({ ...form, releaseDate: e.target.value.trim() })}
          placeholder="请输入发售日期"
        />
      </div>
      <div className="input-wrapper">
        <Radio.Group
          value={form.discType}
          onChange={(e) => setForm({ ...form, discType: e.target.value.trim() })}
        >
          <Radio.Button value="Cd">CD</Radio.Button>
          <Radio.Button value="Bluray">BD</Radio.Button>
          <Radio.Button value="Dvd">DVD</Radio.Button>
          <Radio.Button value="Auto">自动</Radio.Button>
          <Radio.Button value="Other">未知</Radio.Button>
        </Radio.Group>
        <div style={{ marginTop: 20 }}>
          <Button type="primary" loading={posting} onClick={() => doCreateDisc()}>
            创建碟片
          </Button>
        </div>
      </div>
    </div>
  )
}
