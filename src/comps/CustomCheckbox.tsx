import { Checkbox } from 'antd'
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group'

interface Props {
  value: CheckboxValueType[]
  options: Array<CheckboxOptionType>
  onChange: (value: CheckboxValueType[]) => void
}

export function CustomCheckbox(props: Props) {
  const { value, options, onChange } = props
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
    <>
      <Checkbox
        onChange={(e) => onAllChecked(e.target.checked)}
        checked={value.length === options.length}
        children="全选"
      />
      {options.map((option) => (
        <Checkbox
          key={option.value as string}
          checked={value.includes(option.value)}
          children={option.label}
          onChange={(e) => {
            onOneChecked(e.target.checked, option)
          }}
        />
      ))}
    </>
  )
}
