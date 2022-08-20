import { CSSProperties } from 'react'

interface Props {
  style?: CSSProperties
  onClick?: () => void
  iconNode?: JSX.Element
  iconType?: string
  className?: string
}

export const MzIcon = ({ iconNode, iconType, className, ...props }: Props) => {
  if (iconNode) {
    return (
      <span className={`icon-wrapper ${className}`} {...props}>
        {iconNode}
      </span>
    )
  }
  if (iconType) {
    return (
      <span className={`icon-wrapper ${className}`} {...props}>
        {svgIcon(iconType)}
      </span>
    )
  }
  return null
}

function svgIcon(type: string) {
  return (
    <svg
      className="svg-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<use xlink:href="${'#' + type}" />` }}
    />
  )
}
