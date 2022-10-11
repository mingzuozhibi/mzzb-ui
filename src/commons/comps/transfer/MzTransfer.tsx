import { Transfer } from 'antd'
import { TransferDirection } from 'antd/lib/transfer'
import { useState } from 'react'

export interface MzTransferItem {
  key: string
  title: string
  description?: string
  disabled?: boolean
  [name: string]: any
}

interface Props {
  items: MzTransferItem[]
  defaultKeys?: string[]
  onChange?: (keys: string[]) => void
}

export function MzTransfer(props: Props) {
  const [targetKeys, setTargetKeys] = useState<string[]>(props.defaultKeys ?? [])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    const keys = direction === 'right' ? [...targetKeys, ...moveKeys] : nextTargetKeys
    setTargetKeys(keys)
    props.onChange?.(keys)
  }

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  return (
    <Transfer
      dataSource={props.items}
      titles={['可选字段', '排序字段']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      render={(item) => item.title}
    />
  )
}
