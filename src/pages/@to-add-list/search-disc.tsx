import { useAjax } from '#H/useAjax'
import { useLocal } from '#H/useLocal'
import { IDisc } from '#T/disc'
import { isEmpty } from '#U/domain'
import { Button, Input, Modal } from 'antd'
import { useState } from 'react'

interface Props {
  theDiscs: IDisc[]
  addDiscs: IDisc[]
  onPushAdds: (disc: IDisc) => void
}

interface FetchCount {
  value?: number
  timestamp?: number
}

export function SearchDisc(props: Props) {
  const [asin, setAsin] = useState<string>()
  const [count, setCount] = useLocal<FetchCount>('local-fetchcount', {})

  const [loadingDisc, fetchDisc] = useAjax<IDisc>('get')
  const [loadingCount, fetchCount] = useAjax<number>('get')

  function doFetchDisc() {
    if (isEmpty(asin)) {
      Modal.warning({ title: '请检查输入项', content: `碟片ASIN必须输入` })
      return
    }

    if (!asin.match(/^[A-Z0-9]{10}$/)) {
      Modal.warning({ title: '请检查输入项', content: `你输入的ASIN格式不正确` })
      return
    }

    if (props.addDiscs.some((t) => t.asin === asin)) {
      Modal.warning({ title: '请检查输入项', content: `该碟片已存在于待选列表` })
      return
    }

    if (props.theDiscs.some((t) => t.asin === asin)) {
      Modal.warning({ title: '请检查输入项', content: `该碟片已存在于当前列表` })
      return
    }

    fetchDisc(`/api/spider/searchDisc/${asin}`, '查询碟片', {
      onSuccess: props.onPushAdds,
    })
  }

  function doFetchCount() {
    fetchCount('/api/spider/fetchCount', '查询抓取中的碟片数量', {
      onSuccess: (count) => {
        setCount({ value: count, timestamp: Date.now() })
      },
    })
  }

  let buttonName = '抓取中的碟片数量'
  if (count.timestamp && Date.now() - count.timestamp < 3600) {
    buttonName += `(${count.value})`
  }

  return (
    <div className="search-disc">
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
