import { SubmitItem } from '#CC/form/SubmitItem'
import { MzHeader } from '#CC/header/MzHeader'
import { MzPagination } from '#CC/pagination/MzPagination'
import { useResult } from '#CH/useOnce'
import useUrlState from '@ahooksjs/use-url-state'
import { Button, Form, Input, Space } from 'antd'
import { useLocation } from 'react-router-dom'

import { IDisc } from '#DT/disc'
import { DiscTable } from '#RC/@disc-table/disc-table'
import { apiToDiscs } from '#RU/links'

interface FormSearch {
  title?: string
}

export default function DiscSearch() {
  const location = useLocation()
  const apiUrl = apiToDiscs(location.search)

  const { data: result, ...state } = useResult<IDisc[]>(apiUrl, {
    autoScroll: true,
    refreshDeps: [apiUrl],
  })
  const { data: discs, page } = result ?? {}

  const [urlState, setUrlState] = useUrlState<any>({ page: 1, size: 20 })
  const initial: FormSearch = { title: urlState.title }

  const onFinish = ({ title }: FormSearch) => {
    setUrlState({ page: 1, title })
  }

  const onChangePage = (page: number, size: number = 20) => {
    setUrlState({ page, size })
  }

  return (
    <div className="DiscSearch" style={{ maxWidth: 650 }}>
      <MzHeader title="查找碟片" />
      <Form
        style={{ marginTop: 24 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={initial}
        onFinish={onFinish}
      >
        <Form.Item name="title" label="标题">
          <Input.TextArea autoSize={true} allowClear={true} placeholder="请输入想查询的标题" />
        </Form.Item>
        <SubmitItem span={[6, 12]}>
          <Button type="primary" htmlType="submit" loading={state.loading}>
            查询碟片
          </Button>
        </SubmitItem>
      </Form>
      <Space direction="vertical">
        {page && <MzPagination page={page} onChange={onChangePage} />}
        <DiscTable name="bytitle" rows={discs ?? []} />
        {page && <MzPagination page={page} onChange={onChangePage} />}
      </Space>
    </div>
  )
}
