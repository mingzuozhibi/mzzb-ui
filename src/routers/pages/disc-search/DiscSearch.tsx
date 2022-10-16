import { MzHeader } from '#CC/header/MzHeader'
import { MzPagination } from '#CC/pagination/MzPagination'
import { useResult } from '#CH/useOnce'
import { useSearch } from '#CH/useSearch'
import { Checkbox, Input, Space } from 'antd'
import { useLocation } from 'react-router-dom'

import { IDisc } from '#DT/disc'
import { DiscTableCompact } from '#RC/@disc-table/disc-table-compact'
import { apiToDiscs } from '#RU/links'
import { useLocal } from '#CH/useLocal'

interface Initial {
  title?: string
}

export default function DiscSearch() {
  const location = useLocation()
  const apiUrl = apiToDiscs(location.search)

  const { data: result, ...state } = useResult<IDisc[]>(apiUrl, {
    autoScroll: true,
  })
  const { data: discs, page } = result ?? {}

  const [urlState, setUrlState] = useSearch<any>({ page: 1, size: 20 })
  const initial: Initial = { title: urlState.title }

  const [japanCls, setJapanCls] = useLocal('discsearch-japancls', true)

  const onSearch = (title: string) => {
    setUrlState({ page: 1, title })
    state.run()
  }

  const onChangePage = (page: number, size: number = 20) => {
    setUrlState({ page, size })
    state.run()
  }

  return (
    <div className="DiscSearch" style={{ maxWidth: 800 }}>
      <MzHeader
        title="查询碟片"
        extra={[
          <Checkbox key="K1" checked={japanCls} onChange={(e) => setJapanCls(e.target.checked)}>
            日文标题
          </Checkbox>,
        ]}
      />
      <Space direction="vertical">
        <Input.Search
          size="large"
          defaultValue={initial.title}
          placeholder="请输入碟片标题以查询"
          allowClear={true}
          enterButton="Search"
          onSearch={onSearch}
        />
        {page && <MzPagination page={page} onChange={onChangePage} />}
        <DiscTableCompact
          name="bytitle"
          rows={discs}
          sort="none"
          outPage={true}
          hideCols={['idx', japanCls ? 'title' : 'japan']}
        />
        {page && <MzPagination page={page} onChange={onChangePage} />}
      </Space>
    </div>
  )
}
