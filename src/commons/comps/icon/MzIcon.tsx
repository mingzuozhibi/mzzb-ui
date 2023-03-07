import { createFromIconfontCN } from '@ant-design/icons'
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont'

export const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_565515_1amye10w3sh.js',
})

export function MzIcon(props: IconFontProps<string>) {
  const { className, ...extraProps } = props
  return (
    <span className={className}>
      <IconFont {...extraProps} />
    </span>
  )
}
