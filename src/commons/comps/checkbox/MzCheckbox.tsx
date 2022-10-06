import { Checkbox, Space } from 'antd'
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group'

interface Props {
  value: CheckboxValueType[]
  prefix?: React.ReactNode
  options: Array<CheckboxOptionType>
  onChange: (value: CheckboxValueType[]) => void
}

export function MzCheckbox(props: Props) {
  const { value, prefix, options, onChange } = props
  const defaultValue = options.map((e) => e.value)

  function onAllChecked(checked: boolean) {
    onChange(checked ? defaultValue : [])
  }

  function onOneChecked(checked: boolean, option: CheckboxOptionType) {
    if (checked) {
      onChange([...value, option.value])
    } else {
      onChange(value.filter((e) => e !== option.value))
    }
  }

  return (
    <Space wrap={true}>
      {prefix}
      <Checkbox
        style={{ padding: '5px 0' }}
        checked={value.length === options.length}
        onChange={(e) => onAllChecked(e.target.checked)}
      >
        全选
      </Checkbox>
      {options.map((option) => (
        <Checkbox
          key={option.value as string}
          style={{ padding: '5px 0' }}
          checked={value.includes(option.value)}
          onChange={(e) => {
            onOneChecked(e.target.checked, option)
          }}
        >
          {option.label}
        </Checkbox>
      ))}
    </Space>
  )
}
