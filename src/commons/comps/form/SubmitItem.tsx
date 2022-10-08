import { Form, Space } from 'antd'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function SubmitItem(props: Props) {
  return (
    <Form.Item style={{ display: 'flex', justifyContent: 'space-around' }}>
      <Space size="large">{props.children}</Space>
    </Form.Item>
  )
}
