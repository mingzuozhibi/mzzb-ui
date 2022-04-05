import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Input, Modal } from 'antd'
import { isEmpty } from '../../../funcs/domain'
import { useAjax } from '../../../hooks/useAjax'
import { RootState } from '../../../@reducer'
import { Disc } from '../../@types'

interface Params {
  theDiscs: Disc[]
  addDiscs: Disc[]
  pushToAdds: (disc: Disc) => void
  count?: number
  setCount: (count: number) => void
}

export default connect(
  (state: RootState) => ({
    count: state.admin.fetchCount,
  }),
  (dispatch) => ({
    setCount(count: number) {
      dispatch({ type: 'setFetchCount', fetchCount: count })
    },
  })
)(SearchDisc)

function SearchDisc(params: Params) {
  const [asin, setAsin] = useState<string>()
  const [loadingDisc, fetchDisc] = useAjax<Disc>('get')
  const [loadingCount, fetchCount] = useAjax<number>('get')

  function doFetchDisc() {
    if (!isEmpty(asin)) {
      Modal.warning({ title: '请检查输入项', content: `碟片ASIN必须输入` })
      return
    }

    if (!asin.match(/[A-Z0-9]{10}/)) {
      Modal.warning({ title: '请检查输入项', content: `你输入的ASIN格式不正确` })
      return
    }

    if (params.addDiscs.some((t) => t.asin === asin)) {
      Modal.warning({ title: '请检查输入项', content: `该碟片已存在于待选列表` })
      return
    }

    if (params.theDiscs.some((t) => t.asin === asin)) {
      Modal.warning({ title: '请检查输入项', content: `该碟片已存在于当前列表` })
      return
    }

    fetchDisc(`/api/admin/searchDisc/${asin}`, '查询碟片', {
      onSuccess: params.pushToAdds,
    })
  }

  function doFetchCount() {
    fetchCount('/api/admin/fetchCount', '查询抓取中的碟片数量', { onSuccess: params.setCount })
  }

  let buttonName = '抓取中的碟片数量'
  if (params.count !== undefined) {
    buttonName += `(${params.count})`
  }

  return (
    <div className="SearchDisc">
      <div className="input-wrapper">
        <Input
          addonBefore="ASIN"
          onChange={(e) => setAsin(e.target.value.trim())}
          placeholder="请输入ASIN"
        />
      </div>
      <div className="input-wrapper button-group">
        <Button loading={loadingDisc} onClick={doFetchDisc}>
          查找碟片
        </Button>
        <Button loading={loadingCount} onClick={doFetchCount}>
          {buttonName}
        </Button>
      </div>
    </div>
  )
}
