import { useTitle } from '#H/useTitle'
import { Alert, AlertProps, PageHeader, PageHeaderProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import './MzTopbar.scss'

interface Props extends Omit<PageHeaderProps, 'title'> {
  title?: string | { prefix: string; suffix?: string }
  error?: string
}

export function MzTopbar(props: Props) {
  const { error, title, ...otherProps } = props

  let lastTitle: string
  if (title === undefined) {
    lastTitle = '载入中'
  } else if (typeof title === 'string') {
    lastTitle = title
  } else {
    const titleSuffix = title.suffix === undefined ? '载入中' : title.suffix
    lastTitle = `${title.prefix}：${titleSuffix}`
  }

  useTitle(lastTitle)

  const navigate = useNavigate()
  const lastProps: PageHeaderProps = {
    onBack: () => navigate(-1),
    style: { padding: 8 },
    ...otherProps,
  }

  return (
    <div className="MzTopbar">
      <PageHeader title={lastTitle} {...lastProps} />
      <SafeAlert type="error" message={error} />
    </div>
  )
}

function SafeAlert(props: AlertProps) {
  if (props.message === undefined) return null
  return <Alert {...props} />
}
