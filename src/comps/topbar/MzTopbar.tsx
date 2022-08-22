import { Alert, AlertProps, PageHeader, PageHeaderProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import './MzTopbar.scss'

interface Props extends PageHeaderProps {
  error?: string
}

export function MzTopbar(props: Props) {
  const navigate = useNavigate()

  const { error, ...otherProps } = props

  const lastProps: PageHeaderProps = {
    onBack: () => navigate(-1),
    style: { padding: 8 },
    ...otherProps,
  }

  return (
    <div className="MzTopbar">
      <SafeAlert type="error" message={error} />
      <PageHeader {...lastProps} />
    </div>
  )
}

function SafeAlert(props: AlertProps) {
  if (props.message === undefined) return null
  return <Alert {...props} />
}
