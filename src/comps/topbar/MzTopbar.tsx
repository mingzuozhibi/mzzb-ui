import { useTitle } from '#H/useTitle'
import { Alert, AlertProps, PageHeader, PageHeaderProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import './MzTopbar.scss'

interface Props extends PageHeaderProps {
  title: string
  error?: string
}

export function MzTopbar(props: Props) {
  const { error, title, ...otherProps } = props
  useTitle(title)

  const navigate = useNavigate()
  const lastProps: PageHeaderProps = {
    onBack: () => navigate(-1),
    style: { padding: 8 },
    ...otherProps,
  }

  return (
    <div className="MzTopbar">
      <SafeAlert type="error" message={error} />
      <PageHeader title={title} {...lastProps} />
    </div>
  )
}

function SafeAlert(props: AlertProps) {
  if (props.message === undefined) return null
  return <Alert {...props} />
}
