import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Space } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

export type MzItem = ItemType & { disabled?: boolean }

interface Props {
  label: string
  children: MzItem[]
}

export function MzDropdown(props: Props) {
  const { label, children } = props
  return (
    <Dropdown trigger={['click']} overlay={<Menu items={removeDisabled(children)} />}>
      <Button>
        <Space size={0}>
          {label}
          <DownOutlined style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.25)' }} />
        </Space>
      </Button>
    </Dropdown>
  )
}

function removeDisabled(items: MzItem[]) {
  return items
    .filter((item) => item.disabled !== true)
    .map((item) => {
      if ('children' in item && item.children != null) {
        item.children = removeDisabled(item.children as MzItem[])
      }
      return item
    })
}
