import { Col, Row, Space } from 'antd'
import { ReactNode } from 'react'
import './SubmitItem.scss'

interface Props {
  span?: [number, number]
  children: ReactNode
}

export function SubmitItem(props: Props) {
  const [s1, s2] = props.span ?? []
  return (
    <Row className="submit-row">
      <Col className="submit-col-1" span={s1}></Col>
      <Col className="submit-col-2" span={s2}>
        <Space size="large">{props.children}</Space>
      </Col>
    </Row>
  )
}
